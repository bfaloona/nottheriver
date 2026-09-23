// Placeholder so the Worker project type-checks; replaced by the real Worker.
export default {
  async fetch(): Promise<Response> {
    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler;
