import{T as n}from"./constants.6e2b9184.js";let o=[];async function p(){return L(),await h(),E()}async function y(e){const t=`https://www.instagram.com/web/friendships/${e.id}/unfollow/`;return{status:(await(await fetch(t,{headers:{"x-csrftoken":r.config.csrf_token},referrer:`https://www.instagram.com/${e.username}/`,referrerPolicy:"strict-origin-when-cross-origin",method:"POST",mode:"cors",credentials:"include"})).json()).status==="ok",deletedId:e.id}}function O(e){for(const{node:t}of e)o.push({username:t.username,full_name:t.full_name,image:t.profile_pic_url,isFollowingMe:t.follows_viewer,isPrivate:t.is_private,isVerified:t.is_verified,id:t.id})}function P(e){const t=new URL("https://www.instagram.com/graphql/query/");return Object.keys(e).forEach(s=>t.searchParams.append(s,e[s])),t.toString()}async function h(e={}){var l,f,u,d,w,g,_;const t={query_hash:n.FOLLOWING_HASH,variables:JSON.stringify({id:r.config.viewerId,include_reel:!0,fetch_mutual:!1,first:(_=(g=(w=(d=(u=(f=(l=r==null?void 0:r.entry_data)==null?void 0:l.ProfilePage)==null?void 0:f[0])==null?void 0:u.graphql)==null?void 0:d.user)==null?void 0:w.edge_followed_by)==null?void 0:g.count)!=null?_:100,...e.has_next_page&&{after:e.end_cursor}})},s=P(t),a=await fetch(s,{headers:{"Content-Type":"application/json"}}),{data:i}=await a.json();O(i.user.edge_follow.edges);const{has_next_page:c,end_cursor:m}=i.user.edge_follow.page_info;return c?await h({has_next_page:c,end_cursor:m}):Promise.resolve()}function E(){return o.filter(e=>!e.isFollowingMe)}function L(){o=[]}async function F(){return location.href.includes("instagram.com")?(await fetch("/data/shared_data/")).json():void 0}let r;(async()=>(r=await F(),chrome.runtime.onConnect.addListener(e=>{e.onMessage.addListener(async t=>{switch(t.type){case n.GET_PEOPLE:{const s=await p();e.postMessage({users:s,type:n.SET_PEOPLE});break}case n.UNFOLLOW:{const{status:s,deletedId:a}=await y(t.user);e.postMessage({status:s,type:s?n.UNFOLLOWED:n.ERROR,user:t.user,deletedId:a});break}case n.REDIRECT_TO_INSTAGRAM:{location.href="https://www.instagram.com/";break}}})})))();export{r as _sharedData};
