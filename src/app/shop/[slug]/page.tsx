import ProductMain from "@/components/shop/pdp/ProductMain";
import { notFound } from "next/navigation";
import MainWrapper from "@/wrapper/main";
import { Metadata } from "next";
import { fetchProduct, fetchPopularProducts } from "@/utils/fetch-helpers";

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) return { title: "Product Not Found" };

  const { baseProduct, currentVariant } = product;
  const title = `${baseProduct.title} - ${currentVariant.variantName || baseProduct.brand}`;
  const description =
    baseProduct.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) || "";
  const imageUrl =
    currentVariant.images?.[0]?.url || baseProduct.images?.[0]?.url || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    // Pre-render the top 10 products for instant initial load
    const products = await fetchPopularProducts(10);
    return products.map((p: any) => ({
      slug: p.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

const Page = async ({ params }: { params: any }) => {
  const { slug } = await params;
  const productResponse = await fetchProduct(slug);

  if (!slug) {
    return "Slug not found";
  }

  if (!productResponse) {
    return notFound();
  }

  return (
    <MainWrapper>
      <ProductMain productData={productResponse} />
    </MainWrapper>
  );
};

export default Page;
