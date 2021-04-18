pragma solidity ^0.5.0;

contract ImmutableBlog {
  string public name;
  uint public lastPost;
  mapping (uint => Post)  public posts;
  mapping(address => Author) public authors;

  struct Author {
    address payable author;
    string nickname;
  }

  struct Post {
    uint id;
    address payable author;
    string content;
  }

  event AuthorEvent (
    string nickname
  );

  constructor() public {
    name = "ImmutableBlog";
    lastPost = 0;
  }

  function setMyNickname(string memory newNick) public {
    authors[msg.sender] = Author(msg.sender, newNick);
    emit AuthorEvent(newNick);
  }

  function sendNewPost(string memory content) public {
    uint newPostId = ++lastPost;
    require(bytes(content).length > 0);
    posts[newPostId] = Post(newPostId, msg.sender, content);
  }

}

//a = await ImmutableBlog.deployed()
