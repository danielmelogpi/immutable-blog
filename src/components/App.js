import React from "react";
import { Component } from "react";
import Web3 from 'web3'
import Blog from './../abis/ImmutableBlog.json'
import * as _ from 'lodash'
import Post from './Post'
class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    const accounts = await this.getAccounts()
    await this.loadBlockchainData()
    const postCount = await this.getPostCount()
    this.setState({accounts, account: accounts[0], postCount})
    await this.getCurrentPage()
    await this.getMyNickname()
  }

  async getCurrentPage() { // TODO fix pagination
    await this.getPostPage(0, this.state.postCount)
  }

  async getAccounts() {
    return await window.web3.eth.getAccounts()
  }

  async getMyNickname() {
    if (!this.state.account) return ''
    const me = await this.state.blog.methods.authors(this.state.account).call()
    this.setState({
      myNickname: me.nickname
    })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    this.web3 = window.web3
  }

  async loadBlockchainData() {
    const currentNetwork = await this.web3.eth.net.getId()
    const address = _.get(Blog, 'networks.'+ currentNetwork +'.address')
    console.log('address', address)
    if (!address) {
      return window.alert('Contract ImmutableBlog not deployed to current network')
    }
    const blog = new this.web3.eth.Contract(Blog.abi, address)
    this.setState({
      contractAddress: address,
      blog
    })
    window.blog = blog

  }

  constructor(props) {
    super(props)
    this.state = {
      version: 1,
      accounts: [],
      account: '',
      contractAddress: '',
      author: null,
      blog: null,
      timeline: [],
      postCount: null,
      newPostContent: '',
      myNickname: '?',
      authors: {}
    }

    this.handleChangePost = this.handleChangePost.bind(this)
    this.handleNewPost = this.handleNewPost.bind(this)
    this.handleChangeNickname = this.handleChangeNickname.bind(this)
    this.handleSaveNickname = this.handleSaveNickname.bind(this)
  }

  async getPostCount() {
    if (!this.state.blog) {
      return 0
    }
    return await this.state.blog.methods.lastPost().call()
  }

  async getPostPage(offset, limit) {
    for (let i = offset + limit; i>=0; i--) {// TODO remote this sync loop
      let post = await this.state.blog.methods.posts(i).call()
      if (post && post.content) {
        const postAuthor = await this.getAuthor(post.author)
        this.setState({
          timeline: [
            ...this.state.timeline,
            {
              ...post,
              author: postAuthor
            }
          ]
        })
      }
    }
  }

  async getAuthor(authorAddr) {
    const existingAuthor = this.state.authors[authorAddr]
    if (existingAuthor) {
      return existingAuthor
    }
    const author = await this.state.blog.methods.authors(authorAddr).call()
    this.setState({
      authors: {
        ...this.state.authors,
        ...{
          [authorAddr] : author
        }
      }
    })
    return author
  }

  handleChangePost (event) {
    this.setState({newPostContent: event.target.value});
  }

  async handleNewPost() {
    const postContent = this.state.newPostContent
    const postTransaction = await this.state.blog.methods.sendNewPost(postContent).send({from: this.state.account})
    console.log(postTransaction)
    // TODO detect confirmation and remove timeout
    this.setState({
      newPostContent: ''
    })
    this.setState({
      timeline: [
        {
          id: 'new...',
          content: postContent,
          author: {
            nickname: this.state.myNickname
          }
        },
        ...this.state.timeline
      ]
    })
  }

  handleChangeNickname(event) {
    this.setState({myNickname: event.target.value});
  }

  async handleSaveNickname() {
    await this.state.blog.methods.setMyNickname(this.state.myNickname).send({from: this.state.account})
  }

  render() {
    return (<div>
      <section className="header-container">
        <h1>Immutable Blog</h1>
        <div className="account-selector">
          Me:
          <select>
            {this.state.accounts.map(a => this.renderAccount(a))}
          </select>
          <input type="text" value={this.state.myNickname} onChange={this.handleChangeNickname} />
          <input type="button" value="Save nick" onClick={this.handleSaveNickname} disabled={!this.state.myNickname ? 'disabled' : ''} />
        </div>
      </section>

      <section className="container">
        <section className="new-post-container">
          <div className="post-container">
            <textarea rows="3" value={this.state.newPostContent} onChange={this.handleChangePost} resize="0" ></textarea>
            <input type="button" value="Post" onClick={this.handleNewPost} disabled={!this.state.newPostContent ? 'disabled' : ''} />
          </div>
        </section>
        
        <section className="post-section">
          <div className="post-container">
            {this.state.timeline.map(post => (<Post post={post} />))}
          </div>
        </section>
        <section className="footer">
          <small><center>Contract: {this.state.contractAddress}</center></small>
        </section>
      </section>
    </div>)
  }

  renderAccount(account) {
    return (<option key={account}>{account.substring(0, 12)}...</option>)
  }

  renderPost(post) {
    return (
      <div className="post" key={post.id}>
        <div className="content">{post.content}</div>
        <small className="footer">(#{post.id})</small>
      </div>
    )
  }


}
export default App