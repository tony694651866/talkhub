// 全站交互状态（Mock 会话态：加入吧 / 点赞 / 收藏 / 关注 / 投票）
import { reactive } from 'vue'
import type { Post, Comment, Forum } from '~/../shared/types'

const joinedSlugs = reactive(new Set<string>(['game', 'dev', 'photo']))
const likedIds = reactive(new Set<string>())
const favIds = reactive(new Set<string>())
const likedComments = reactive(new Set<string>())
const followedUsers = reactive(new Set<string>())
const votedPost = reactive(new Map<string, number>())

export function useInteraction() {
  const isJoined = (slug: string) => joinedSlugs.has(slug)
  const toggleJoin = (forum: Forum) => {
    if (joinedSlugs.has(forum.slug)) joinedSlugs.delete(forum.slug)
    else joinedSlugs.add(forum.slug)
    return joinedSlugs.has(forum.slug)
  }
  const isLiked = (id: string) => likedIds.has(id)
  const toggleLike = (post: Post) => {
    if (likedIds.has(post.id)) { likedIds.delete(post.id); post.likeCount-- } else { likedIds.add(post.id); post.likeCount++ }
    return likedIds.has(post.id)
  }
  const isFav = (id: string) => favIds.has(id)
  const toggleFav = (post: Post) => {
    if (favIds.has(post.id)) { favIds.delete(post.id); post.favoriteCount-- } else { favIds.add(post.id); post.favoriteCount++ }
    return favIds.has(post.id)
  }
  const isCommentLiked = (id: string) => likedComments.has(id)
  const toggleCommentLike = (c: Comment) => {
    if (likedComments.has(c.id)) { likedComments.delete(c.id); c.likeCount-- } else { likedComments.add(c.id); c.likeCount++ }
  }
  const isFollowed = (username: string) => followedUsers.has(username)
  const toggleFollow = (username: string) => {
    if (followedUsers.has(username)) followedUsers.delete(username)
    else followedUsers.add(username)
  }
  const getVote = (postId: string) => votedPost.get(postId)
  const castVote = (postId: string, optionIndex: number) => {
    const prev = votedPost.get(postId)
    votedPost.set(postId, optionIndex)
    return prev
  }
  return { isJoined, toggleJoin, isLiked, toggleLike, isFav, toggleFav, isCommentLiked, toggleCommentLike, isFollowed, toggleFollow, getVote, castVote }
}
