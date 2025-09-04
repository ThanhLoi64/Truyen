// FormEditSeries.jsx
import React from 'react';
import {
    Container, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, Alert
} from '@mui/material';

const FormEditSeries = ({
    name, setName, title, setTitle, author, setAuthor, categoryId, setCategoryId, categories, summary, setSummary, isPublic, setIsPublic, isCompleted, setIsCompleted, useCoverAsThumbnail, setUseCoverAsThumbnail,
    coverPreview, thumbnailPreview, handleCoverChange, handleThumbnailChange, handleSubmit, error, successMessage
}) => {
    return (
        <Container className="pl-[9rem] mb-1">
            <Typography variant="h4" align="center" gutterBottom>
                Sửa Truyện
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="flex  gap-6">
                    <div className="w-full md:w-1/2">
                        <div className="flex gap-6 mb-4">
                            <div className="flex items-center justify-center w-full">

                                <label htmlFor="cover-file" className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {coverPreview ? (
                                            <img src={coverPreview} alt="Cover Preview" className="h-16 w-16 object-cover" />
                                        ) : (
                                            <>
                                                <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> Cover</p>
                                            </>

                                        )}

                                    </div>
                                    <input onChange={handleCoverChange} id="cover-file" type="file" className="hidden" />
                                </label>
                            </div>
                            {!useCoverAsThumbnail && (
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="thumbnail-file" className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {thumbnailPreview ? (
                                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-16 w-16 object-cover" />
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> Thumbnail</p>
                                                </>
                                            )}
                                        </div>
                                        <input onChange={handleThumbnailChange} id="thumbnail-file" type="file" className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={useCoverAsThumbnail}
                                    onChange={(e) => setUseCoverAsThumbnail(e.target.checked)}
                                    name="useCoverAsThumbnail"
                                    color="primary"
                                />
                            }
                            label="Sử dụng ảnh bìa làm ảnh thu nhỏ"
                        />
                        <div className="grid gap-x-5 md:grid-cols-2">
                            <TextField
                                label="Tiêu đề"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Đường dẫn"
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Tác giả"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="categoryId-label">Danh mục</InputLabel>
                                <Select
                                    labelId="categoryId-label"
                                    id="categoryId"
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    label="Danh mục"
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>


                        </div>
                        <Button
                            className="bg-[--button] w-[100%] justify-center text-center hover:bg-[--button]"
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Cập nhật Truyện
                        </Button>
                    </div>
                    <div className="w-full md:w-1/2  flex flex-wrap ">
                        <TextField

                            label="Tóm tắt"
                            id="summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            multiline
                            rows={10}
                            fullWidth

                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    name="isPublic"
                                    color="primary"
                                />
                            }
                            label="Công khai"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isCompleted}
                                    onChange={(e) => setIsCompleted(e.target.checked)}
                                    name="isCompleted"
                                    color="primary"
                                />
                            }
                            label="Đã hoàn thành"
                        />

                    </div>
                </div>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                {successMessage && <Alert severity="success" sx={{ mt: 2 }}>{successMessage}</Alert>}
            </form>
        </Container>


    );
};

export default FormEditSeries;
