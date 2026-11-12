import apiClient from '../apiClient';

export const transcriptService = {
  // POST /api/transcript - Multer field: "media" (or JSON/FormData for YouTube URL)
  generateTranscript: async (payload, onUploadProgress) => {
    let data;
    let headers = {};

    if (payload instanceof FormData) {
      data = payload;
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      data = payload;
    }

    const response = await apiClient.post('/transcript', data, {
      headers,
      onUploadProgress,
    });
    return response.data;
  },

  // GET /api/transcript - Transcript History list
  getTranscriptHistory: async (params = {}) => {
    const response = await apiClient.get('/transcript', { params });
    return response.data;
  },

  // GET /api/transcript/search - Search transcripts
  searchTranscript: async (query) => {
    const response = await apiClient.get('/transcript/search', {
      params: { q: query },
    });
    return response.data;
  },

  // GET /api/transcript/:id - Single Transcript Details
  getTranscriptById: async (id) => {
    const response = await apiClient.get(`/transcript/${id}`);
    return response.data;
  },

  // DELETE /api/transcript/:id - Delete Transcript
  deleteTranscript: async (id) => {
    const response = await apiClient.delete(`/transcript/${id}`);
    return response.data;
  },

  // GET /api/transcript/:id/download/:format (txt, srt, vtt)
  downloadTranscript: async (id, format) => {
    const response = await apiClient.get(`/transcript/${id}/download/${format}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};