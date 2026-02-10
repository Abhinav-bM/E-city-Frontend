import { getProduct } from "@/api/product";
import MainWrapper from "@/wrapper/main";
import ProductDetails from "@/components/shop/ProductDetails";
import { notFound } from "next/navigation";

const fetchProduct = async (slug: string) => {
  try {
    const response = await getProduct(slug);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

const Page = async ({ params }: { params: any }) => {
  const { slug } = await params;
  const productResponse = await fetchProduct(slug);

  if (!productResponse) {
    return notFound();
  }

  return (
    <MainWrapper>
      <section className="custom-padding my-10">
        <ProductDetails productData={productResponse} />
      </section>
    </MainWrapper>
  );
};

export default Page;
