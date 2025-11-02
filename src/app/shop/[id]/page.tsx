import { getProduct } from "@/api/product";
import CheckoutContainer from "@/components/checkoutContainer";
import ProductImageViewer from "@/components/productImageViewer";
import ProductVariantSelector from "@/components/productVariantSelector";
import MainWrapper from "@/wrapper/main";

const fetchProduct = async (id: any) => {
  try {
    const response = await getProduct(id);
    return response.data.data;
  } catch (error) {
    console.log("Error fetching products:", error);
  }
};

const page = async ({ params }: { params: any }) => {
  const { id } = await params;
  const product = await fetchProduct(id);

  console.log(product)

  return (
    <MainWrapper>
      <section className=" custom-padding flex flex-col md:flex-row gap-10 my-10">
        <div className="w-full">
          <ProductImageViewer product={product} />
        </div>

        <div className=" w-full">
          <h1 className="text-2xl  md:text-3xl font-normal">{product.name}</h1>
          <ProductVariantSelector product={product} />

          {/* <CheckoutContainer product={product} /> */}

          <div className=" my-5">
            <h6 className=" font-semibold mb-2">Product Description</h6>
            <article className="prose prose-sm">{product.description}</article>
          </div>
        </div>
      </section>
    </MainWrapper>
  );
};

export default page;
