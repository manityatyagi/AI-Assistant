const router = {
  navigate: (path) => {
    if (typeof window !== 'undefined' && path) {
      window.location.href = path;
    }
  }
};

export default router;
