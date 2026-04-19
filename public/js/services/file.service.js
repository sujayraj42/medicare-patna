/**
 * File Service — PDF Upload + Blob Storage
 * Uses browser File API + localStorage index (Capacitor Filesystem when native)
 */
const FileService = (() => {
  const FILES_KEY = 'medicare_files_index';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  function getFileIndex() {
    try { return JSON.parse(localStorage.getItem(FILES_KEY) || '[]'); } catch { return []; }
  }

  function saveFileIndex(index) {
    localStorage.setItem(FILES_KEY, JSON.stringify(index));
  }

  /**
   * Upload a file — stores metadata + base64 data in localStorage (web)
   * In Capacitor, would use Filesystem.writeFile for larger storage
   */
  async function uploadFile(file, category = 'general') {
    if (!file) return { success: false, error: 'No file selected' };
    if (file.size > MAX_FILE_SIZE) return { success: false, error: 'File exceeds 10MB limit' };

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Only PDF, JPEG, PNG, and WebP files are supported' };
    }

    try {
      const base64 = await readFileAsBase64(file);
      const entry = {
        id: globalThis.crypto?.randomUUID?.() || `file_${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        category,
        uploadedAt: new Date().toISOString(),
        data: base64
      };

      const index = getFileIndex();
      index.unshift(entry);
      saveFileIndex(index);

      return { success: true, file: { ...entry, data: undefined } };
    } catch (err) {
      return { success: false, error: err.message || 'Upload failed' };
    }
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Trigger camera/file picker via hidden input
   * @param {string} source - 'camera' | 'file'
   * @param {Function} onComplete - callback(result)
   */
  function pickFile(source, onComplete) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = source === 'camera' ? 'image/*' : '.pdf,.jpg,.jpeg,.png,.webp';
    if (source === 'camera') input.capture = 'environment';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const result = await uploadFile(file);
      if (onComplete) onComplete(result);
    };

    input.click();
  }

  function getFiles(category) {
    const index = getFileIndex();
    if (category) return index.filter(f => f.category === category);
    return index;
  }

  function getFileById(id) {
    return getFileIndex().find(f => f.id === id);
  }

  function deleteFile(id) {
    const index = getFileIndex().filter(f => f.id !== id);
    saveFileIndex(index);
  }

  function getFileCount(category) {
    if (category) return getFileIndex().filter(f => f.category === category).length;
    return getFileIndex().length;
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  return { uploadFile, pickFile, getFiles, getFileById, deleteFile, getFileCount, formatSize };
})();

export default FileService;
