import { useEffect } from "react";
import { useFetcher } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
            demoInfo: metafield(namespace: "$app", key: "demo_info") {
              jsonValue
            }
          }
        }
      }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
          metafields: [
            {
              namespace: "$app",
              key: "demo_info",
              value: "Created by React Router Template",
            },
          ],
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();
  const metaobjectResponse = await admin.graphql(
    `#graphql
    mutation shopifyReactRouterTemplateUpsertMetaobject($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          id
          handle
          title: field(key: "title") {
            jsonValue
          }
          description: field(key: "description") {
            jsonValue
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        handle: {
          type: "$app:example",
          handle: "demo-entry",
        },
        metaobject: {
          fields: [
            { key: "title", value: "Demo Entry" },
            {
              key: "description",
              value:
                "This metaobject was created by the Shopify app template to demonstrate the metaobject API.",
            },
          ],
        },
      },
    },
  );
  const metaobjectResponseJson = await metaobjectResponse.json();

  return {
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
    metaobject: metaobjectResponseJson.data.metaobjectUpsert.metaobject,
  };
};

export default function Index() {
  return (
    <s-page heading="BundleIQ Dashboard">

      <s-section heading="Overview">

        <s-stack direction="inline" gap="base">

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
          >
            <s-heading>Total Bundles</s-heading>
            <s-text>12</s-text>
          </s-box>

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
          >
            <s-heading>Active Bundles</s-heading>
            <s-text>9</s-text>
          </s-box>

          <s-box
            padding="base"
            borderWidth="base"
            borderRadius="base"
          >
            <s-heading>Average Score</s-heading>
            <s-text>84</s-text>
          </s-box>

        </s-stack>

      </s-section>

      <s-section heading="Top Bundle Opportunities">

        <s-box
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-heading>
            #1 Mountain Adventure Bundle
          </s-heading>

          <s-text>
            Bundle Score: 92
          </s-text>
        </s-box>

        <s-box
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-heading>
            #2 City Explorer Bundle
          </s-heading>

          <s-text>
            Bundle Score: 87
          </s-text>
        </s-box>

        <s-box
          padding="base"
          borderWidth="base"
          borderRadius="base"
        >
          <s-heading>
            #3 Beach Weekend Bundle
          </s-heading>

          <s-text>
            Bundle Score: 81
          </s-text>
        </s-box>

      </s-section>

      <s-section heading="Recent Activity">

        <s-unordered-list>
          <s-list-item>
            Mountain Adventure Bundle created
          </s-list-item>

          <s-list-item>
            City Explorer Bundle updated
          </s-list-item>

          <s-list-item>
            Beach Weekend Bundle archived
          </s-list-item>
        </s-unordered-list>

      </s-section>

    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
