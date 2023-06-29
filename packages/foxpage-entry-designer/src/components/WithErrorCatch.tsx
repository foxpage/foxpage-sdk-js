import React from 'react';

interface WithErrorCatchProps {
  addError?: () => void;
  removeError?: () => void;
  componentId: string;
  componentName: string;
  componentType: string;
  componentNode: any;
}

interface WithErrorCatchState {
  withError: boolean;
}

class WithErrorCatch extends React.Component<WithErrorCatchProps, WithErrorCatchState> {
  static defaultProps = {
    componentId: '',
    componentName: '',
    componentType: '',
    ComponentNode: {},
    addError: () => {},
    removeError: () => {},
  };
  constructor(props: any) {
    super(props);
    this.state = {
      withError: false,
    };
    props.removeError();
  }

  componentDidCatch() {
    this.setState({
      withError: true,
    });
  }

  render() {
    const { componentNode = null, componentName, componentId } = this.props;

    if (this.state.withError) {
      return (
        <div
          style={{
            textAlign: 'center',
            padding: 10,
            fontSize: '14px',
            border: '1px solid #ff9898',
            color: '#ff4141',
            background: '#ffdada',
          }}
        >
          {`Component ${componentName} [${componentId}] render error.`}
        </div>
      );
    }

    return componentNode;
  }
}

export default WithErrorCatch;
