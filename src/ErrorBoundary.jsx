import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: '10vh',
                    backgroundColor: 'rgba(192, 0, 0, 0.3)'
                }}>
                    <h1>Something went wrong</h1>
                    <h2>Please, reload the page 🔄</h2>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary