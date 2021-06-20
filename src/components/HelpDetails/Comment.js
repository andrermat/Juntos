//get comment from list of comments
//get the user currently logged in (authed user) so that we can toggle likes on comments
//get the authed user to enable reply to comment
const Comment = (props) => {
  return (
    <div>
      <img src={props.ownerPicture} alt="foto-perfil" />
      <h6>{props.ownerFirstName + " " + props.ownerLastName}</h6>
      <p>{props.text}</p>
      <p>{props.date}</p>
    </div>
  );
};

export default Comment;

/*
In the comment Component, we need to pick out a tweet with a specific id from the current list of comments.

That means that we can store the comments in the store and make the comment Page Component, the Dashboard Component, and the comment Component 
into containers (components that have access to the store via the connect function).

As soon as that data changes — if someone likes the tweet, for example — all of the components that use that data will update.

{
  tweets: {
    tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo},
    tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo}
  },
  users: {
    userId: {userId, userName, avatar, tweetsArray},
    userId: {userId, userName, avatar, tweetsArray}
  }
}
*/