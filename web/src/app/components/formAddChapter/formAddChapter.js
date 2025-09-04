"use client";
import React from 'react';
import { Container, Typography, Box, TextField, FormControlLabel, Checkbox, Button, Snackbar, FormHelperText } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import '../MDEditorCustom.css';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });
import { commands } from '@uiw/react-md-editor';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

const filterEmojis = (text) => {
    return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
        .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
        .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
        .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
        .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
        .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
        .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
        .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
        .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/[\u{2300}-\u{23FF}]/gu, '');
};

const FormAddChapter = ({
    handleSubmit,
    title,
    setTitle,
    name,
    setName,
    publishDate,
    setPublishDate,
    isPublic,
    handlePublicChange,
    body,
    setBody,
    handleSaveDraft,
    handlePublish,
    openSnackbar,
    handleCloseSnackbar,
    snackbarMessage,
    snackbarSeverity,
    publishDateRef
}) => {
    const customCommands = [
        {
            name: 'undo',
            keyCommand: 'undo',
            buttonProps: { 'aria-label': 'Undo' },
            icon: <UndoIcon fontSize="small" />,
            execute: () => {
                document.execCommand('undo');
            },
        },
        {
            name: 'redo',
            keyCommand: 'redo',
            buttonProps: { 'aria-label': 'Redo' },
            icon: <RedoIcon fontSize="small" />,
            execute: () => {
                document.execCommand('redo');
            },
        },
    ];

    const toolbarCommands = [
        ...customCommands,
        ...commands.getCommands().filter(cmd => cmd.name !== 'emoji')
    ];

    const handleBodyChange = (value) => {
        setBody(filterEmojis(value));
    };

    return (
        <Container maxWidth="md" className="mt-6" component="div">
            <Typography variant="h4" align="center" gutterBottom>
                Thêm chương
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <TextField
                            label="Tên chương"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            variant="outlined"
                            required
                        />
                        <TextField
                            label="Đường dẫn (tự động)"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: 'row' }}>
                        <TextField
                            label="Ngày xuất bản"
                            id="publishDate"
                            type="date"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                            disabled={!isPublic}
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            inputRef={publishDateRef}
                            sx={{
                                flex: 1,
                                cursor: isPublic ? 'text' : 'not-allowed',
                                backgroundColor: !isPublic || new Date(publishDate) < new Date().toISOString().split('T')[0] ? '#f0f0f0' : 'inherit',
                            }}
                            inputProps={{
                                min: new Date().toISOString().split('T')[0],
                            }}
                        />
                        <FormControlLabel
                            control={<Checkbox id="isPublic" checked={isPublic} onChange={handlePublicChange} />}
                            label="Lên lịch"
                            sx={{ ml: 7 }}
                        />
                        <FormHelperText id="component-helper-text">
                            Không chọn ngày sẽ lấy thời gian hiện tại
                        </FormHelperText>
                    </Box>
                    <div data-color-mode="light" style={{ mt: 3, border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa', padding: '16px' }}>
                        <MDEditor
                            value={body}
                            onChange={handleBodyChange}
                            height={400}
                            commands={toolbarCommands}
                        />
                    </div>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            onClick={handleSaveDraft}
                            variant="contained"
                            color="secondary"
                            sx={{ backgroundColor: 'var(--textSoft)' }}
                        >
                            Lưu nháp
                        </Button>
                        <Button
                            onClick={handlePublish}
                            variant="contained"
                            color="secondary"
                            sx={{ backgroundColor: 'var(--button)' }}
                        >
                            Xuất bản
                        </Button>
                    </Box>
                    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                        <MuiAlert variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>
                </Box>
            </form>
        </Container>
    );
}

export default FormAddChapter;
