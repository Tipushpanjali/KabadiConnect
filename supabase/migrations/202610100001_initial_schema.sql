create extension if not exists pgcrypto;

create type public.account_role as enum ('user','recycler','society','admin');
create type public.account_status as enum ('active','suspended','pending');
create type public.pickup_status as enum ('Requested','Accepted','On the Way','Collected','Sorted','Processing','Recycling','Completed','Rejected','Cancelled');
create type public.document_status as enum ('pending','approved','rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '', phone text, role public.account_role not null default 'user',
  account_status public.account_status not null default 'active', avatar_path text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
declare requested text;
begin
  requested := new.raw_user_meta_data ->> 'requested_role';
  insert into public.profiles(id, full_name, phone, role)
  values(new.id, coalesce(new.raw_user_meta_data ->> 'full_name',''), new.raw_user_meta_data ->> 'phone',
    case when requested in ('recycler','society') then requested::public.account_role else 'user'::public.account_role end)
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.has_role(wanted public.account_role) returns boolean language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = wanted and p.account_status = 'active')
$$;
create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$ select public.has_role('admin') $$;
create function public.profile_role(uid uuid) returns public.account_role language sql stable security definer set search_path = '' as $$ select role from public.profiles where id=uid $$;
create function public.profile_status(uid uuid) returns public.account_status language sql stable security definer set search_path = '' as $$ select account_status from public.profiles where id=uid $$;

create table public.user_addresses (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id) on delete cascade,
 label text not null, address_line text not null, city text, region text, postal_code text,
 latitude double precision, longitude double precision, is_default boolean not null default false,
 created_at timestamptz not null default now(), check(latitude is null or latitude between -90 and 90), check(longitude is null or longitude between -180 and 180)
);
create unique index one_default_address_per_user on public.user_addresses(user_id) where is_default;

create table public.societies (
 id uuid primary key default gen_random_uuid(), name text not null, address text not null, manager_id uuid references public.profiles(id) on delete set null,
 contact_email text, contact_phone text, status text not null default 'pending' check(status in ('pending','active','suspended')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.society_memberships (
 id uuid primary key default gen_random_uuid(), society_id uuid not null references public.societies(id) on delete cascade,
 user_id uuid not null references public.profiles(id) on delete cascade, membership_role text not null default 'member' check(membership_role in ('manager','member')),
 status text not null default 'pending' check(status in ('pending','active','removed')), joined_at timestamptz not null default now(), unique(society_id,user_id)
);
create table public.recycler_profiles (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null unique references public.profiles(id) on delete cascade,
 business_name text not null default '', business_details text, service_areas text[] not null default '{}', contact_phone text,
 available boolean not null default false, verification_status text not null default 'pending' check(verification_status in ('pending','verified','rejected')),
 average_rating numeric(3,2) not null default 0 check(average_rating between 0 and 5), review_count integer not null default 0 check(review_count >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create view public.recycler_directory with (security_invoker=true) as
 select id,business_name,business_details,service_areas,available,verification_status,average_rating,review_count
 from public.recycler_profiles where verification_status='verified';
grant select on public.recycler_directory to anon,authenticated;
grant select (id,business_name,business_details,service_areas,available,verification_status,average_rating,review_count) on public.recycler_profiles to anon;
create function public.initialize_recycler_profile() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.role='recycler' then
  insert into public.recycler_profiles(owner_id,business_name,contact_phone) values(new.id,new.full_name,new.phone) on conflict(owner_id) do nothing;
 end if;
 return new;
end $$;
create trigger initialize_recycler_after_profile_insert after insert on public.profiles for each row execute function public.initialize_recycler_profile();
create function public.protect_recycler_review_fields() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_admin() and (new.verification_status is distinct from old.verification_status or new.average_rating is distinct from old.average_rating or new.review_count is distinct from old.review_count) then
   raise exception 'Verification and review totals are system managed';
 end if;
 return new;
end $$;
create trigger protect_recycler_fields before update on public.recycler_profiles for each row execute function public.protect_recycler_review_fields();

create table public.waste_categories(id text primary key, display_name text not null, active boolean not null default true);
insert into public.waste_categories(id,display_name) values ('paper','Paper'),('cardboard','Cardboard'),('plastic','Plastic'),('metal','Metal'),('glass','Glass'),('ewaste','E-Waste') on conflict do nothing;
create table public.recycler_rates(
 id uuid primary key default gen_random_uuid(), recycler_id uuid not null references public.recycler_profiles(id) on delete cascade,
 category_id text not null references public.waste_categories(id), rate_per_kg numeric(10,2) not null check(rate_per_kg >= 0), accepts boolean not null default true,
 updated_at timestamptz not null default now(), unique(recycler_id,category_id)
);
grant select (recycler_id,category_id,rate_per_kg,accepts,updated_at) on public.recycler_rates to anon;
grant select on public.recycler_rates to authenticated;

create table public.pickup_requests(
 id uuid primary key default gen_random_uuid(), public_reference text not null unique default ('KC-' || upper(substr(encode(extensions.gen_random_bytes(6),'hex'),1,10))),
 customer_id uuid not null references public.profiles(id), recycler_id uuid not null references public.recycler_profiles(id),
 category_id text not null references public.waste_categories(id), estimated_quantity numeric(9,2) not null check(estimated_quantity between 0.1 and 10000),
 final_quantity numeric(9,2) check(final_quantity is null or final_quantity between 0.1 and 10000),
 scheduled_at timestamptz not null, address_snapshot jsonb not null, estimated_price numeric(12,2) not null check(estimated_price >= 0),
 final_value numeric(12,2) check(final_value is null or final_value >= 0), status public.pickup_status not null default 'Requested', notes text, image_path text,
 cancellation_reason text, rejection_reason text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index pickup_customer_idx on public.pickup_requests(customer_id,created_at desc);
create index pickup_recycler_status_idx on public.pickup_requests(recycler_id,status,scheduled_at);
create table public.pickup_status_history(id uuid primary key default gen_random_uuid(), pickup_id uuid not null references public.pickup_requests(id) on delete cascade,
 previous_status public.pickup_status, new_status public.pickup_status not null, actor_id uuid references public.profiles(id), note text, created_at timestamptz not null default now());

create table public.points_accounts(user_id uuid primary key references public.profiles(id) on delete cascade, balance bigint not null default 0 check(balance >= 0), updated_at timestamptz not null default now());
create table public.points_ledger(id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), amount bigint not null check(amount <> 0),
 entry_type text not null check(entry_type in ('earned','bonus','redemption','adjustment')), reference_id uuid, description text, created_at timestamptz not null default now());
create unique index points_ledger_reference_once on public.points_ledger(user_id,entry_type,reference_id) where reference_id is not null;
create table public.pickup_transactions(id uuid primary key default gen_random_uuid(), pickup_id uuid not null unique references public.pickup_requests(id),
 recycler_id uuid not null references public.recycler_profiles(id), amount numeric(12,2) not null check(amount >= 0), payment_status text not null default 'recorded' check(payment_status in ('recorded','paid','disputed','reversed')), settled_at timestamptz);
create table public.rewards(id uuid primary key default gen_random_uuid(), title text not null, description text, partner text, points_cost bigint not null check(points_cost > 0), reward_type text not null, active boolean not null default true, redemption_limit integer check(redemption_limit is null or redemption_limit > 0));
insert into public.rewards(title,description,partner,points_cost,reward_type,active) values
 ('Brew & Co Coffee Voucher','Rs. 100 off your next order.','Brew & Co',400,'Partner coupon',true),
 ('Metro Card Recharge','Rs. 150 added to your metro card.','City Transit',600,'Discount',true),
 ('FreshBasket 10% Off','10% off groceries up to Rs. 300.','FreshBasket',800,'Discount',true),
 ('Sapling Starter Kit','Neem or tulsi sapling with a planter.','Urban Roots',500,'Community reward',true),
 ('Plant a Tree in Your Society','Your points fund a tree in your society park.','Green Valley RWA',300,'Community reward',true),
 ('Eco Champion Badge','A badge for your profile and leaderboard.','Kabadi Connect',200,'Recycling badge',true);
create table public.reward_redemptions(id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), reward_id uuid not null references public.rewards(id),
 points_spent bigint not null check(points_spent > 0), idempotency_key uuid not null, status text not null default 'requested' check(status in ('requested','fulfilled','cancelled')), redemption_reference text not null unique default ('RW-' || upper(substr(encode(extensions.gen_random_bytes(6),'hex'),1,10))), created_at timestamptz not null default now(), unique(user_id,idempotency_key));

create table public.recycler_reviews(id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.profiles(id), recycler_id uuid not null references public.recycler_profiles(id), pickup_id uuid not null unique references public.pickup_requests(id), rating smallint not null check(rating between 1 and 5), comment text, created_at timestamptz not null default now());
create table public.notifications(id uuid primary key default gen_random_uuid(), recipient_id uuid not null references public.profiles(id) on delete cascade, notification_type text not null, message text not null, related_id uuid, read_at timestamptz, created_at timestamptz not null default now());
create index notifications_recipient_idx on public.notifications(recipient_id,created_at desc);
create table public.notification_preferences(user_id uuid primary key references public.profiles(id) on delete cascade, pickup_updates boolean not null default true, points boolean not null default true, society_challenges boolean not null default true, promotions boolean not null default false);
create table public.recycler_documents(id uuid primary key default gen_random_uuid(), recycler_id uuid not null references public.recycler_profiles(id) on delete cascade,
 document_type text not null check(document_type in ('government_photo_id','business_trade_licence','weighing_scale_certificate','address_proof')), storage_path text not null unique,
 review_status public.document_status not null default 'pending', reviewer_id uuid references public.profiles(id), rejection_reason text, created_at timestamptz not null default now(), reviewed_at timestamptz,
 unique(recycler_id,document_type));
create function public.protect_recycler_document_review() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if not public.is_admin() and (new.recycler_id is distinct from old.recycler_id or new.document_type is distinct from old.document_type or new.review_status<>'pending' or new.reviewer_id is not null or new.rejection_reason is not null or new.reviewed_at is not null) then
  raise exception 'Document review fields are administrator managed';
 end if;
 return new;
end $$;
create trigger protect_recycler_document_review before update on public.recycler_documents for each row execute function public.protect_recycler_document_review();
create table public.society_challenges(id uuid primary key default gen_random_uuid(), society_id uuid not null references public.societies(id) on delete cascade, title text not null, target_kg numeric(12,2) not null check(target_kg > 0), starts_at timestamptz not null, ends_at timestamptz not null, active boolean not null default true, check(ends_at > starts_at));
create table public.challenge_participation(id uuid primary key default gen_random_uuid(), challenge_id uuid not null references public.society_challenges(id) on delete cascade, user_id uuid not null references public.profiles(id) on delete cascade, progress_kg numeric(12,2) not null default 0 check(progress_kg >= 0), joined_at timestamptz not null default now(), unique(challenge_id,user_id));
create table public.support_reports(id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id), subject text not null, details text not null, pickup_id uuid references public.pickup_requests(id), status text not null default 'open' check(status in ('open','investigating','resolved')), created_at timestamptz not null default now());
create table public.admin_audit_log(id uuid primary key default gen_random_uuid(), admin_id uuid not null references public.profiles(id), action text not null, entity_type text not null, entity_id uuid, details jsonb not null default '{}', created_at timestamptz not null default now());

create function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at=now(); return new; end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger societies_touch before update on public.societies for each row execute function public.touch_updated_at();
create trigger recycler_profiles_touch before update on public.recycler_profiles for each row execute function public.touch_updated_at();
create trigger pickup_requests_touch before update on public.pickup_requests for each row execute function public.touch_updated_at();
create trigger points_accounts_touch before update on public.points_accounts for each row execute function public.touch_updated_at();
create function public.notify_pickup_request() returns trigger language plpgsql security definer set search_path = '' as $$
declare owner uuid;
begin
 select owner_id into owner from public.recycler_profiles where id=new.recycler_id;
 insert into public.notifications(recipient_id,notification_type,message,related_id) values(owner,'pickup','A new pickup request is waiting for your response.',new.id);
 return new;
end $$;
create trigger pickup_request_notify after insert on public.pickup_requests for each row execute function public.notify_pickup_request();
create function public.notify_pickup_transition() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.status is distinct from old.status then
  insert into public.notifications(recipient_id,notification_type,message,related_id)
   values(new.customer_id,'pickup','Pickup ' || new.public_reference || ' status changed to ' || new.status::text || '.',new.id);
 end if;
 return new;
end $$;
create trigger pickup_transition_notify after update of status on public.pickup_requests for each row execute function public.notify_pickup_transition();
create function public.notify_reward_redemption() returns trigger language plpgsql security definer set search_path = '' as $$
declare label text;
begin
 select title into label from public.rewards where id=new.reward_id;
 insert into public.notifications(recipient_id,notification_type,message,related_id) values(new.user_id,'reward','Reward redemption requested: ' || coalesce(label,'reward') || '.',new.id);
 return new;
end $$;
create trigger reward_redemption_notify after insert on public.reward_redemptions for each row execute function public.notify_reward_redemption();
create function public.sync_recycler_verification() returns trigger language plpgsql security definer set search_path = '' as $$
declare owner uuid; total_count integer; approved_count integer; rejected_count integer;
begin
 select owner_id into owner from public.recycler_profiles where id=new.recycler_id;
 select count(*),count(*) filter(where review_status='approved'),count(*) filter(where review_status='rejected')
 into total_count,approved_count,rejected_count from public.recycler_documents where recycler_id=new.recycler_id;
 update public.recycler_profiles set verification_status=case when total_count>=4 and approved_count=4 then 'verified' when rejected_count>0 then 'rejected' else 'pending' end where id=new.recycler_id;
 if new.review_status<>'pending' and (tg_op='INSERT' or new.review_status is distinct from old.review_status) then
  insert into public.notifications(recipient_id,notification_type,message,related_id) values(owner,'verification','A verification document was ' || new.review_status::text || '.',new.id);
  if auth.uid() is not null and public.is_admin() then insert into public.admin_audit_log(admin_id,action,entity_type,entity_id,details) values(auth.uid(),'document_' || new.review_status::text,'recycler_document',new.id,jsonb_build_object('recycler_id',new.recycler_id,'type',new.document_type)); end if;
 end if;
 return new;
end $$;
create trigger recycler_document_review after insert or update of review_status on public.recycler_documents for each row execute function public.sync_recycler_verification();
create function public.audit_account_status() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.account_status is distinct from old.account_status and auth.uid() is not null and public.is_admin() then
  insert into public.admin_audit_log(admin_id,action,entity_type,entity_id,details) values(auth.uid(),'account_status_' || new.account_status::text,'profile',new.id,jsonb_build_object('previous',old.account_status));
 end if;
 return new;
end $$;
create trigger profile_status_audit after update of account_status on public.profiles for each row execute function public.audit_account_status();
create function public.audit_report_status() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.status is distinct from old.status and auth.uid() is not null and public.is_admin() then
  insert into public.admin_audit_log(admin_id,action,entity_type,entity_id,details) values(auth.uid(),'report_status_' || new.status,'support_report',new.id,jsonb_build_object('previous',old.status));
 end if;
 return new;
end $$;
create trigger report_status_audit after update of status on public.support_reports for each row execute function public.audit_report_status();

create function public.create_pickup(p_recycler uuid,p_category text,p_quantity numeric,p_scheduled timestamptz,p_address jsonb,p_notes text default null,p_image_path text default null)
returns public.pickup_requests language plpgsql security definer set search_path = '' as $$
declare rate numeric; result public.pickup_requests;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_quantity not between 0.1 and 10000 then raise exception 'Quantity is outside allowed range'; end if;
 if p_scheduled <= now() or p_scheduled > now() + interval '90 days' then raise exception 'Choose a valid pickup time within 90 days'; end if;
 if jsonb_typeof(p_address)<>'object' or length(trim(coalesce(p_address->>'address_line',''))) < 10 then raise exception 'A complete pickup address is required'; end if;
 if p_image_path is not null and p_image_path not like auth.uid()::text || '/%' then raise exception 'Pickup photo path is invalid'; end if;
 select rr.rate_per_kg into rate from public.recycler_rates rr join public.recycler_profiles rp on rp.id=rr.recycler_id join public.waste_categories wc on wc.id=rr.category_id
 where rr.recycler_id=p_recycler and rr.category_id=p_category and rr.accepts and wc.active and rp.verification_status='verified' and rp.available;
 if rate is null then raise exception 'Recycler is unavailable for this material'; end if;
 insert into public.pickup_requests(customer_id,recycler_id,category_id,estimated_quantity,scheduled_at,address_snapshot,estimated_price,notes,image_path)
 values(auth.uid(),p_recycler,p_category,p_quantity,p_scheduled,p_address,round(rate*p_quantity,2),p_notes,p_image_path) returning * into result;
 insert into public.pickup_status_history(pickup_id,new_status,actor_id) values(result.id,'Requested',auth.uid());
 return result;
end $$;

create function public.transition_pickup(p_pickup uuid,p_status public.pickup_status,p_final_quantity numeric default null,p_final_value numeric default null,p_note text default null)
returns public.pickup_requests language plpgsql security definer set search_path = '' as $$
declare p public.pickup_requests; old_status public.pickup_status; allowed boolean := false; actor uuid := auth.uid(); rate numeric;
begin
 if actor is null then raise exception 'Authentication required'; end if;
 select * into p from public.pickup_requests where id=p_pickup for update;
 if not found then raise exception 'Pickup not found'; end if;
 old_status := p.status;
 if p.customer_id=actor and p_status='Cancelled' and p.status in ('Requested','Accepted') then allowed:=true; end if;
 if exists(select 1 from public.recycler_profiles rp where rp.id=p.recycler_id and rp.owner_id=actor) then
   allowed := (p.status='Requested' and p_status in ('Accepted','Rejected')) or
    (p.status='Accepted' and p_status='On the Way') or (p.status='On the Way' and p_status='Collected') or
    (p.status='Collected' and p_status='Sorted') or (p.status='Sorted' and p_status='Processing') or
    (p.status='Processing' and p_status='Recycling') or (p.status='Recycling' and p_status='Completed');
 end if;
 if public.is_admin() then allowed := (p_status='Cancelled' and p.status not in ('Completed','Cancelled')); end if;
 if not allowed then raise exception 'Status transition is not permitted'; end if;
 if p_status='Completed' and (p_final_quantity is null or p_final_quantity not between 0.1 and 10000) then raise exception 'Final quantity is required'; end if;
 if p_status='Completed' then
   select rr.rate_per_kg into rate from public.recycler_rates rr where rr.recycler_id=p.recycler_id and rr.category_id=p.category_id and rr.accepts;
   if rate is null then raise exception 'No active recycler rate is available for settlement'; end if;
 end if;
 update public.pickup_requests set status=p_status, final_quantity=case when p_status='Completed' then p_final_quantity else final_quantity end,
 final_value=case when p_status='Completed' then round(rate*p_final_quantity,2) else final_value end, cancellation_reason=case when p_status='Cancelled' then p_note else cancellation_reason end,
 rejection_reason=case when p_status='Rejected' then p_note else rejection_reason end, updated_at=now() where id=p_pickup returning * into p;
 insert into public.pickup_status_history(pickup_id,previous_status,new_status,actor_id,note) values(p.id,old_status,p_status,actor,p_note);
 if p_status='Completed' then
   insert into public.pickup_transactions(pickup_id,recycler_id,amount,payment_status,settled_at) values(p.id,p.recycler_id,p.final_value,'recorded',now()) on conflict(pickup_id) do nothing;
   insert into public.points_accounts(user_id) values(p.customer_id) on conflict do nothing;
   insert into public.points_ledger(user_id,amount,entry_type,reference_id,description) values(p.customer_id,round(p.final_quantity*8)+20,'earned',p.id,'Completed pickup') on conflict do nothing;
   update public.points_accounts set balance=balance+(round(p.final_quantity*8)+20),updated_at=now() where user_id=p.customer_id
    and exists(select 1 from public.points_ledger where user_id=p.customer_id and reference_id=p.id and entry_type='earned');
 end if;
 return p;
end $$;

create function public.redeem_reward(p_reward uuid,p_idempotency_key uuid) returns public.reward_redemptions language plpgsql security definer set search_path = '' as $$
declare r public.rewards; v_balance bigint; redemption public.reward_redemptions; used_count integer;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select * into r from public.rewards where id=p_reward and active for update;
 if not found then raise exception 'Reward unavailable'; end if;
 insert into public.points_accounts(user_id) values(auth.uid()) on conflict do nothing;
 select a.balance into v_balance from public.points_accounts a where a.user_id=auth.uid() for update;
 select * into redemption from public.reward_redemptions where user_id=auth.uid() and idempotency_key=p_idempotency_key;
 if found then if redemption.reward_id<>p_reward then raise exception 'Idempotency key was already used for another reward'; end if; return redemption; end if;
 if r.redemption_limit is not null then select count(*) into used_count from public.reward_redemptions where reward_id=p_reward and status<>'cancelled'; if used_count>=r.redemption_limit then raise exception 'Reward redemption limit reached'; end if; end if;
 if v_balance < r.points_cost then raise exception 'Insufficient points'; end if;
 update public.points_accounts a set balance=a.balance-r.points_cost,updated_at=now() where a.user_id=auth.uid();
 insert into public.reward_redemptions(user_id,reward_id,points_spent,idempotency_key) values(auth.uid(),p_reward,r.points_cost,p_idempotency_key) returning * into redemption;
 insert into public.points_ledger(user_id,amount,entry_type,reference_id,description) values(auth.uid(),-r.points_cost,'redemption',redemption.id,'Reward redemption');
 return redemption;
end $$;
DROP FUNCTION IF EXISTS public.leaderboard(integer);
create function public.leaderboard(
  p_limit integer default 100
  )
returns table(entity_type text,entity_id uuid,display_name text,score numeric,is_you boolean)
language sql stable security definer set search_path = '' as $$
 with entries as (
  select 'user'::text as kind,p.id,
   split_part(trim(p.full_name),' ',1)||case when split_part(trim(p.full_name),' ',2)<>'' then ' '||left(split_part(trim(p.full_name),' ',2),1)||'.' else '' end as label,
   coalesce(pa.balance,0)::numeric as value
  from public.profiles p left join public.points_accounts pa on pa.user_id=p.id
  where p.role='user' and p.account_status='active'
  union all
  select 'recycler'::text,r.id,r.business_name::text,
   count(pr.id)::numeric
  from public.recycler_profiles r left join public.pickup_requests pr on pr.recycler_id=r.id and pr.status='Completed'
  where r.verification_status='verified' and r.available group by r.id,r.business_name
  union all
  select 'society'::text,s.id,s.name::text,
   coalesce(sum(pr.final_quantity),0)::numeric
  from public.societies s left join public.society_memberships sm on sm.society_id=s.id and sm.status='active'
  left join public.pickup_requests pr on pr.customer_id=sm.user_id and pr.status='Completed'
  where s.status='active' group by s.id,s.name
 )
 select e.kind,e.id,e.label,e.value,e.id=(select auth.uid())
 from entries e order by e.value desc,e.label limit greatest(1,least(coalesce(p_limit,100),100));
$$;

create function public.log_pickup_status() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 if new.status is distinct from old.status then
 insert into public.pickup_status_history(pickup_id,previous_status,new_status,actor_id) values(new.id,old.status,new.status,auth.uid());
 end if; return new;
end $$;
-- History is recorded by the transition RPC so actor and note remain paired.

alter table public.profiles enable row level security;
alter table public.user_addresses enable row level security;
alter table public.societies enable row level security;
alter table public.society_memberships enable row level security;
alter table public.recycler_profiles enable row level security;
alter table public.waste_categories enable row level security;
alter table public.recycler_rates enable row level security;
alter table public.pickup_requests enable row level security;
alter table public.pickup_status_history enable row level security;
alter table public.points_accounts enable row level security;
alter table public.points_ledger enable row level security;
alter table public.pickup_transactions enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.recycler_reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.recycler_documents enable row level security;
alter table public.society_challenges enable row level security;
alter table public.challenge_participation enable row level security;
alter table public.support_reports enable row level security;
alter table public.admin_audit_log enable row level security;

create policy profiles_read_self_admin on public.profiles for select to authenticated using(id=auth.uid() or public.is_admin());
create policy profiles_update_self on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid() and role=public.profile_role(auth.uid()) and account_status=public.profile_status(auth.uid()));
create policy profiles_admin_all on public.profiles for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy addresses_owner on public.user_addresses for all to authenticated using(user_id=auth.uid() or public.is_admin()) with check(user_id=auth.uid() or public.is_admin());
create policy societies_read on public.societies for select to authenticated using(status='active' or manager_id=auth.uid() or public.is_admin());
create policy societies_admin_write on public.societies for all to authenticated using(public.is_admin()) with check(public.is_admin());
create policy membership_self_manager_admin_read on public.society_memberships for select to authenticated using(user_id=auth.uid() or public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid()));
create policy membership_manager_write on public.society_memberships for all to authenticated using(public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid())) with check(public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid()));
create policy recycler_profiles_read on public.recycler_profiles for select to authenticated using(verification_status='verified' or owner_id=auth.uid() or public.is_admin());
create policy recycler_profiles_public_read on public.recycler_profiles for select to anon using(verification_status='verified');
create policy recycler_profile_owner_write on public.recycler_profiles for all to authenticated using(owner_id=auth.uid() or public.is_admin()) with check(owner_id=auth.uid() or public.is_admin());
create policy categories_read on public.waste_categories for select to anon,authenticated using(active);
create policy rates_read on public.recycler_rates for select to anon,authenticated using(true);
create policy rates_owner_write on public.recycler_rates for all to authenticated using(exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()) or public.is_admin()) with check(exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()) or public.is_admin());
create policy pickup_read_owner_recycler_admin on public.pickup_requests for select to authenticated using(customer_id=auth.uid() or public.is_admin() or exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()));
create policy pickup_admin_update on public.pickup_requests for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy pickup_history_access on public.pickup_status_history for select to authenticated using(exists(select 1 from public.pickup_requests p where p.id=pickup_id and (p.customer_id=auth.uid() or public.is_admin() or exists(select 1 from public.recycler_profiles r where r.id=p.recycler_id and r.owner_id=auth.uid()))));
create policy points_account_self_admin on public.points_accounts for select to authenticated using(user_id=auth.uid() or public.is_admin());
create policy points_ledger_self_admin on public.points_ledger for select to authenticated using(user_id=auth.uid() or public.is_admin());
create policy transactions_recycler_admin_read on public.pickup_transactions for select to authenticated using(public.is_admin() or exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()));
create policy rewards_public_read on public.rewards for select to anon,authenticated using(active);
create policy redemptions_owner_admin on public.reward_redemptions for select to authenticated using(user_id=auth.uid() or public.is_admin());
create policy reviews_read on public.recycler_reviews for select to anon,authenticated using(true);
grant select (id,recycler_id,rating,comment,created_at) on public.recycler_reviews to anon,authenticated;
create policy reviews_create_eligible on public.recycler_reviews for insert to authenticated with check(customer_id=auth.uid() and exists(select 1 from public.pickup_requests p where p.id=pickup_id and p.customer_id=auth.uid() and p.recycler_id=recycler_id and p.status='Completed'));
create policy notifications_owner on public.notifications for all to authenticated using(recipient_id=auth.uid() or public.is_admin()) with check(recipient_id=auth.uid() or public.is_admin());
create policy preferences_owner on public.notification_preferences for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy documents_owner_admin_read on public.recycler_documents for select to authenticated using(public.is_admin() or exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()));
create policy documents_owner_insert on public.recycler_documents for insert to authenticated with check(exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()));
create policy documents_owner_resubmit on public.recycler_documents for update to authenticated using(exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid())) with check(exists(select 1 from public.recycler_profiles r where r.id=recycler_id and r.owner_id=auth.uid()));
create policy documents_admin_review on public.recycler_documents for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy challenges_read on public.society_challenges for select to authenticated using(active or public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid()));
create policy challenges_manager_write on public.society_challenges for all to authenticated using(public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid())) with check(public.is_admin() or exists(select 1 from public.societies s where s.id=society_id and s.manager_id=auth.uid()));
create policy challenge_participation_read on public.challenge_participation for select to authenticated using(user_id=auth.uid() or public.is_admin() or exists(select 1 from public.society_challenges c join public.society_memberships m on m.society_id=c.society_id where c.id=challenge_id and m.user_id=auth.uid() and m.membership_role='manager'));
create policy challenge_participation_self_insert on public.challenge_participation for insert to authenticated with check(user_id=auth.uid());
create policy reports_self_admin on public.support_reports for select to authenticated using(reporter_id=auth.uid() or public.is_admin());
create policy reports_create_self on public.support_reports for insert to authenticated with check(reporter_id=auth.uid());
create policy reports_admin_update on public.support_reports for update to authenticated using(public.is_admin()) with check(public.is_admin());
create policy audit_admin_read on public.admin_audit_log for select to authenticated using(public.is_admin());

revoke all on function public.create_pickup(uuid,text,numeric,timestamptz,jsonb,text,text) from public;
grant execute on function public.create_pickup(uuid,text,numeric,timestamptz,jsonb,text,text) to authenticated;
revoke all on function public.transition_pickup(uuid,public.pickup_status,numeric,numeric,text) from public;
grant execute on function public.transition_pickup(uuid,public.pickup_status,numeric,numeric,text) to authenticated;
revoke all on function public.redeem_reward(uuid,uuid) from public;
grant execute on function public.redeem_reward(uuid,uuid) to authenticated;
grant execute on function public.leaderboard(integer) to anon,authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('pickup-photos','pickup-photos',false,5242880,array['image/jpeg','image/png','image/webp']),
 ('recycler-documents','recycler-documents',false,10485760,array['image/jpeg','image/png','application/pdf']),
 ('avatars','avatars',true,3145728,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy pickup_photo_owner on storage.objects for all to authenticated using(bucket_id='pickup-photos' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='pickup-photos' and (storage.foldername(name))[1]=auth.uid()::text);
create policy recycler_document_owner on storage.objects for all to authenticated using(bucket_id='recycler-documents' and exists(select 1 from public.recycler_profiles r where r.owner_id=auth.uid() and r.id::text=(storage.foldername(name))[1])) with check(bucket_id='recycler-documents' and exists(select 1 from public.recycler_profiles r where r.owner_id=auth.uid() and r.id::text=(storage.foldername(name))[1]));
create policy recycler_document_admin_read on storage.objects for select to authenticated using(bucket_id='recycler-documents' and public.is_admin());
create policy avatar_public_read on storage.objects for select to anon,authenticated using(bucket_id='avatars');
create policy avatar_owner_write on storage.objects for all to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='pickup_requests') then alter publication supabase_realtime add table public.pickup_requests; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then alter publication supabase_realtime add table public.notifications; end if;
 end if;
end $$;
