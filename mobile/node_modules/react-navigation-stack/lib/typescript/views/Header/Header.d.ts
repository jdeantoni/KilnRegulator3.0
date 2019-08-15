import * as React from 'react';
import { SceneInterpolatorProps, HeaderProps } from '../../types';
declare type Props = HeaderProps & {
    leftLabelInterpolator: (props: SceneInterpolatorProps) => any;
    leftButtonInterpolator: (props: SceneInterpolatorProps) => any;
    titleFromLeftInterpolator: (props: SceneInterpolatorProps) => any;
    layoutInterpolator: (props: SceneInterpolatorProps) => any;
};
declare const _default: React.ComponentType<Pick<Props, "scene" | "navigation" | "position" | "mode" | "backTitleVisible" | "layoutPreset" | "scenes" | "layout" | "transitionPreset" | "leftInterpolator" | "titleInterpolator" | "rightInterpolator" | "backgroundInterpolator" | "leftLabelInterpolator" | "leftButtonInterpolator" | "titleFromLeftInterpolator" | "layoutInterpolator">>;
export default _default;
