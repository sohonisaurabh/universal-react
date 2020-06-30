/**
 * Created by dcha17 on 1/5/2018.
 */

import React, { ReactNode } from 'react';

import styles from './Spinner.style';
import withStyles from '../../../lib/withStyles';

type Props = {
  others?: Element | ReactNode | Array<ReactNode>;
  overlayEnabled?: boolean;
  spinner?: boolean;
  spinnerClassName?: string;
  className: string;
};

const Spinner: React.FC<Props> = props => {
  const renderDefaultSpinner = (props: Props) => <div {...props} className="rclDefaultSpinner" />;

  const renderCustomSpinner = (props: Props) => (
    <div {...props} className="renderDotSpinner">
      <div className="renderDotSpinner--dot" />
      <div className="renderDotSpinner--dot" />
      <div className="renderDotSpinner--dot" />
    </div>
  );

  const renderSpinner = (props: Props) => renderDefaultSpinner(props);

  const renderDotSpinner = (props: Props) => renderCustomSpinner(props);

  const { className, spinner, overlayEnabled } = props;
  if (overlayEnabled) {
    return (
      <div className={className}>{spinner ? renderSpinner(props) : renderDotSpinner(props)}</div>
    );
  }
  return null;
};

Spinner.defaultProps = {
  others: null,
  overlayEnabled: false,
};

export default withStyles(Spinner, styles);
export { Spinner as SpinnerVanilla };
