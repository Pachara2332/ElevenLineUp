
import prisma from '@/lib/prisma';

async function main() {
  console.log('🔄 Starting URL migration...');

  const posts = await prisma.post.findMany({
    where: {
      imageUrl: {
        startsWith: 'community/posts/'
      }
    }
  });

  console.log(`Found ${posts.length} posts with relative URLs.`);

  const domain = process.env.NEXT_PUBLIC_R2_DOMAIN;
  if (!domain) {
      console.error('❌ NEXT_PUBLIC_R2_DOMAIN is missing');
      process.exit(1);
  }

  for (const post of posts) {
      if (!post.imageUrl || post.imageUrl.startsWith('http')) continue;

      const newUrl = `${domain}/${post.imageUrl}`;
      
      console.log(`Fixing Post ${post.id}: ${post.imageUrl} -> ${newUrl}`);
      
      await prisma.post.update({
          where: { id: post.id },
          data: { imageUrl: newUrl }
      });
  }

  console.log('✨ Migration complete.');
}

main()
  .catch(e => {
      console.error(e);
      process.exit(1);
  });
