import * as React from 'react';
import { HeaderBackbuttonProps } from '../../types';
declare type Props = HeaderBackbuttonProps & {
    LabelContainerComponent: React.ComponentType;
    ButtonContainerComponent: React.ComponentType;
};
declare type State = {
    initialTextWidth?: number;
};
declare class ModularHeaderBackButton extends React.PureComponent<Props, State> {
    static defaultProps: {
        tintColor: string;
        truncatedTitle: string;
    };
    state: State;
    private onTextLayout;
    private renderBackImage;
    private getTitleText;
    private maybeRenderTitle;
    render(): JSX.Element;
}
export default ModularHeaderBackButton;
