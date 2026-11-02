export function hasAccess(session,adminRecord){return Boolean(session?.user?.id&&adminRecord?.id===session.user.id);}
