import { User, Post, Comment, Community } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'alex_modern',
    displayName: 'Alex Modern',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=alex_modern',
    bio: 'Digital designer and technology enthusiast',
    joinedAt: '2023-06-12T10:30:00Z',
    karma: 1542
  },
  {
    id: 'user-2',
    username: 'techguru',
    displayName: 'Tech Guru',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=techguru',
    bio: 'Software engineer sharing insights about the latest technologies',
    joinedAt: '2023-01-05T15:20:00Z',
    karma: 4281
  },
  {
    id: 'user-3',
    username: 'design_pioneer',
    displayName: 'Design Pioneer',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=design_pioneer',
    bio: 'UX/UI designer passionate about creating beautiful experiences',
    joinedAt: '2023-03-18T08:45:00Z',
    karma: 2167
  },
  {
    id: 'user-4',
    username: 'code_wizard',
    displayName: 'Code Wizard',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=code_wizard',
    bio: 'Full-stack developer, open source contributor, and tech writer',
    joinedAt: '2022-11-20T13:10:00Z',
    karma: 3098
  }
];

export const mockCommunities: Community[] = [
  {
    id: 'comm-1',
    name: 'webdev',
    displayName: 'Web Development',
    description: 'A community for web developers to share knowledge, resources, and experiences.',
    memberCount: 32567,
    createdAt: '2022-01-15T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=webdev',
    banner: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
  },
  {
    id: 'comm-2',
    name: 'design',
    displayName: 'Design Inspiration',
    description: 'Share your latest designs, get feedback, and find inspiration from other designers.',
    memberCount: 18943,
    createdAt: '2022-02-20T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=design',
    banner: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg'
  },
  {
    id: 'comm-3',
    name: 'tech',
    displayName: 'Technology News',
    description: 'The latest in technology, science, and digital culture.',
    memberCount: 45782,
    createdAt: '2021-11-05T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=tech',
    banner: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg'
  },
  {
    id: 'comm-4',
    name: 'gaming',
    displayName: 'Gaming Community',
    description: 'For gamers by gamers. Discussions about video games, esports, and gaming culture.',
    memberCount: 67321,
    createdAt: '2021-08-12T00:00:00Z',
    avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=gaming',
    banner: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg'
  }
];

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    title: 'The Evolution of Modern Web Development',
    content: 'As we head deeper into 2025, web development continues to evolve at a rapid pace. New frameworks and tools are emerging, while existing ones are being refined to offer better developer experiences and performance. What trends have you noticed in your own work?',
    authorId: 'user-1',
    communityId: 'comm-1',
    createdAt: '2025-05-01T14:32:00Z',
    upvotes: 284,
    downvotes: 12,
    commentCount: 42,
    imageUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg'
  },
  {
    id: 'post-2',
    title: 'Minimalist Design Trend for 2025',
    content: 'Minimalism continues to dominate digital design in 2025. The focus on essential elements, clean interfaces, and purposeful whitespace creates a seamless user experience. Share your favorite minimalist designs!',
    authorId: 'user-3',
    communityId: 'comm-2',
    createdAt: '2025-05-02T10:15:00Z',
    upvotes: 176,
    downvotes: 8,
    commentCount: 23,
    imageUrl: 'https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg'
  },
  {
    id: 'post-3',
    title: 'The Rise of AI in Development Tools',
    content: 'AI-powered development tools are transforming how we write code, test applications, and maintain systems. These tools can suggest code completions, automatically write tests, and even identify potential bugs before they make it to production. What AI tools have improved your workflow?',
    authorId: 'user-2',
    communityId: 'comm-3',
    createdAt: '2025-05-03T09:45:00Z',
    upvotes: 342,
    downvotes: 15,
    commentCount: 67,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
  },
  {
    id: 'post-4',
    title: 'Gaming on Apple Vision Pro: A New Era',
    content: 'The gaming experience on Apple Vision Pro has reached new heights with the latest update. Immersive environments, intuitive controls, and stunning graphics make it a game-changer for VR gaming. What games are you enjoying most on this platform?',
    authorId: 'user-4',
    communityId: 'comm-4',
    createdAt: '2025-05-04T16:20:00Z',
    upvotes: 528,
    downvotes: 24,
    commentCount: 89,
    imageUrl: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg'
  }
];

export const mockComments: Comment[] = [
  {
    id: 'comment-1',
    content: 'I\'ve noticed a significant shift towards edge computing and distributed architectures. This approach allows for better performance and reliability by processing data closer to where it\'s needed.',
    authorId: 'user-2',
    postId: 'post-1',
    createdAt: '2025-05-01T15:10:00Z',
    upvotes: 48,
    downvotes: 2
  },
  {
    id: 'comment-2',
    content: 'The rise of WASM (WebAssembly) has been fascinating to watch. It\'s enabling high-performance applications in the browser that weren\'t possible before. I\'ve been using it for complex visualizations with great results.',
    authorId: 'user-4',
    postId: 'post-1',
    createdAt: '2025-05-01T16:05:00Z',
    upvotes: 36,
    downvotes: 0
  },
  {
    id: 'comment-3',
    content: 'I love how minimalism focuses on the content first approach. It\'s not just about aesthetics but also about enhancing usability and accessibility.',
    authorId: 'user-1',
    postId: 'post-2',
    createdAt: '2025-05-02T11:20:00Z',
    upvotes: 29,
    downvotes: 1
  },
  {
    id: 'comment-4',
    content: 'AI code completion has changed how I write code completely. What used to take hours now takes minutes. It\'s especially helpful for boilerplate code and common patterns.',
    authorId: 'user-3',
    postId: 'post-3',
    createdAt: '2025-05-03T10:30:00Z',
    upvotes: 54,
    downvotes: 3
  },
  {
    id: 'comment-5',
    content: 'The spatial computing aspect of Vision Pro makes strategy games so much more engaging. Being able to manipulate game elements in 3D space feels incredibly intuitive.',
    authorId: 'user-2',
    postId: 'post-4',
    createdAt: '2025-05-04T17:15:00Z',
    upvotes: 41,
    downvotes: 2
  }
];