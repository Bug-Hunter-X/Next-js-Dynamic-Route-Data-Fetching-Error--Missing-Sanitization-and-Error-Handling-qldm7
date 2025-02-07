// bugSolution.js
import { useRouter } from 'next/router';

export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;

  // Sanitize the ID (example using a regular expression)
  const sanitizedId = id.replace(/[^a-zA-Z0-9]/g, '');

  // Fetch data, handle potential errors
  try {
    const res = await fetch(`https://api.example.com/products/${sanitizedId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
    const data = await res.json();

    if (!data.product) {
      return {
        notFound: true,
      };
    }

    return {
      props: { product: data.product },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: { error: error.message },
    };
  }
}

export default function Product({ product, error }) {
  const router = useRouter();
  
  if (error) {
    return <p>Error loading product: {error}</p>;
  }
  
  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
