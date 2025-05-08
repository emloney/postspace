import { Community } from '../types';
import { mockCommunities } from '../data/mockData';

export const getCommunityById = (communityId: string): Community | undefined => {
  return mockCommunities.find(community => community.id === communityId);
};

export const getCommunityByName = (name: string): Community | undefined => {
  return mockCommunities.find(community => community.name.toLowerCase() === name.toLowerCase());
};