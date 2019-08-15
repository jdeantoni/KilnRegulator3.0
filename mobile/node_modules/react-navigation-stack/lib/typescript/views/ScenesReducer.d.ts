import { Scene, NavigationState, SceneDescriptor } from '../types';
export default function ScenesReducer(scenes: Scene[], nextState: NavigationState, prevState: NavigationState | null, descriptors: {
    [key: string]: SceneDescriptor;
}): Scene[];
