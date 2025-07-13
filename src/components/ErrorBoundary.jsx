// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';

// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false };
//     }

//     static getDerivedStateFromError() {
//         return { hasError: true };
//     }

//     componentDidCatch(error, errorInfo) {
//         console.error('Error Boundary Caught:', error, errorInfo);
//     }

//     handleReload = () => {
//         this.setState({ hasError: false });
//         window.location.reload();
//     };

//      render() {
//     if (this.state.hasError) {
//       return (
//         <Box
//           sx={{
//             textAlign: 'center',
//             py: 6,
//             px: 2,
//             backgroundColor: 'background.paper', // unify with theme
//             color: 'text.primary',
//           }}
//         >
//           <Typography
//             variant="h4"
//             sx={{ fontWeight: 700, color: 'error.main', mb: 2 }}
//           >
//             Something went wrong.
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 3 }}>
//             Please try refreshing the page or come back later.
//           </Typography>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={this.handleReload}
//             sx={{ fontWeight: 600 }}
//           >
//             Refresh Page
//           </Button>
//         </Box>
//       );
//     }
//     return this.props.children;
//   }
// }

// export default ErrorBoundary;

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    componentDidMount() {
        // Always check for error message in localStorage
        const errorMessage = localStorage.getItem('error_message');
        if (errorMessage) {
            this.setState({ hasError: true, errorMessage });
        }
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const errorMessage = localStorage.getItem('error_message') || 'Something went wrong.';
        this.setState({ errorMessage });
        console.error('Error Boundary Caught:', error, errorInfo);
    }

        handleReload = () => {
        const prevUrl = localStorage.getItem('error_prev_url') || '/';
        this.setState({ hasError: false, errorMessage: '' });
        localStorage.removeItem('error_message');
        localStorage.removeItem('error_prev_url');
        window.location.href = prevUrl; // Redirect to the original page
    };

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 2,
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 700, color: 'error.main', mb: 2 }}
                    >
                        Something went wrong.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {this.state.errorMessage}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReload}
                        sx={{ fontWeight: 600 }}
                    >
                        Refresh Page
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;