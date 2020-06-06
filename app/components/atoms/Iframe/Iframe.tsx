import React, { PureComponent } from 'react';
import styles from './Iframe.style';
import withStyles from '../../../lib/withStyles';

type Props = {
  className: string;
  sourceUrl: string;
  iframeTitle: string;
  inheritedStyles?: string | {};
  onLoad?: (event: React.SyntheticEvent) => void;
  width?: string;
  height?: string;
  takeContentHeight?: boolean;
  frameBorder?: string;
};

type State = {
  frameHeight: string;
};

class Iframe extends PureComponent<Props, State> {
  private iframe: HTMLIFrameElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      frameHeight: '100%',
    };

    //@ts-ignore
    this.iframe = <iframe title="no iframe" />;
  }

  static defaultProps = {
    inheritedStyles: '',
    width: '100%',
    height: '100%',
    frameBorder: '0',
    takeContentHeight: false,
    onLoad: () => {},
  };

  render() {
    const {
      className,
      sourceUrl,
      iframeTitle,
      inheritedStyles,
      onLoad,
      width,
      height,
      takeContentHeight,
      frameBorder,
      ...others
    }: Props = this.props;

    const { frameHeight } = this.state;

    return (
      <iframe
        ref={iframe => {
          this.iframe = iframe;
        }}
        className={className}
        title={iframeTitle}
        src={sourceUrl}
        width={width}
        height={takeContentHeight ? frameHeight : height}
        frameBorder={frameBorder}
        onLoad={event => {
          if (takeContentHeight) {
            const { document } = this.iframe.contentWindow;
            this.setState({
              frameHeight: `${document ? document.body.scrollHeight : 0}px`,
            });
          }
          if (typeof onLoad === 'function') {
            onLoad(event);
          }
        }}
        {...others}
      />
    );
  }
}

export default withStyles(Iframe, styles);
export { Iframe as IframeComponent };
