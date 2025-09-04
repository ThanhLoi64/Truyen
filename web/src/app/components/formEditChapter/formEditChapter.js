import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Checkbox, Button, Snackbar, FormControlLabel, FormHelperText, Alert } from '@mui/material';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import '../MDEditorCustom.css';
import { commands } from '@uiw/react-md-editor';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const FormEditChapter = ({
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
  const [titleError, setTitleError] = useState(false);
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
    ...commands.getCommands(),
  ];
  return (
    <Container maxWidth="md" className="mt-6" component="div">
      <Typography variant="h4" align="center" gutterBottom>
        Chỉnh sửa chương
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <TextField
              label="Tiêu đề"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              variant="outlined"
              required
              error={titleError}
              helperText={titleError ? 'Tiêu đề phải có ít nhất 3 ký tự' : ''}
            />
            <TextField
              label="Tên chương (tự động)"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              disabled
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Ngày xuất bản"
              id="publishDate"
              type="date"
              value={publishDate || ''}
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
          <div data-color-mode="light" sx={{ mt: 3, border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fafafa', padding: '16px' }}>
            <MDEditor
              value={body}
              onChange={setBody}
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
            <Alert variant="filled" onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </form>
    </Container>
  );
}

export default FormEditChapter;
