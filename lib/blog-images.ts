const blogImages = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515378791036-0648a814c963?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
];

export function getBlogImage(index: number) {
  return blogImages[index % blogImages.length];
}