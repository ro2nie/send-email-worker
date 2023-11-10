import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { SendEmail } from 'endpoints/sendEmail';

export const router = OpenAPIRouter({
  docs_url: '/',
  //this should be added to the routes in cf dashboard ie: ronnie.dev/heberinelca/*
  //without a base, then mapping a worker to a route is impossible. Use this to map to sub path in website
  base: '/:websiteName',
});

router.post('/api/send/', SendEmail);

// 404 for everything else
router.all('*', () =>
  Response.json(
    {
      success: false,
      error: 'Route not found',
    },
    { status: 404 }
  )
);

export default {
  fetch: router.handle,
};
