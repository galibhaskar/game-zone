import { Box, Modal } from '@mui/material';

export const Loader = () => {
    return <Modal open>
        <Box sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            width: 400,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1>
                {`Please wait...  `}
            </h1>
        </Box>
    </Modal>;
}