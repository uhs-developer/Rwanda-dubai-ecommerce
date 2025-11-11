import { gql } from 'urql';

// ========== STOREFRONT CATEGORIES ==========
export const GET_STOREFRONT_CATEGORIES = gql`
  query GetStorefrontCategories {
    categories {
      id
      name
      slug
      image
      productCount
      children {
        id
        name
        slug
        productCount
      }
    }
  }
`;

export const GET_CATEGORIES_WITH_MIN_PRODUCTS = gql`
  query GetCategoriesWithMinProducts {
    categories {
      id
      name
      slug
      image
      productCount
      children {
        id
        name
        slug
        productCount
      }
    }
  }
`;

// ========== STOREFRONT PRODUCTS ==========
export const GET_STOREFRONT_PRODUCTS = gql`
  query GetStorefrontProducts(
    $q: String
    $page: Int
    $perPage: Int
    $categorySlug: String
    $brandSlug: String
  ) {
    products(
      q: $q
      page: $page
      perPage: $perPage
      categorySlug: $categorySlug
      brandSlug: $brandSlug
    ) {
      data {
        id
        sku
        name
        slug
        price
        specialPrice
        shortDescription
        description
        images {
          url
          label
          role
        }
        categories {
          id
          name
          slug
        }
        brand {
          id
          name
          slug
        }
      }
      paginatorInfo {
        currentPage
        lastPage
        perPage
        total
      }
    }
  }
`;

export const GET_CATEGORY_PRODUCTS = gql`
  query GetCategoryProducts(
    $categorySlug: String!
    $page: Int
    $perPage: Int
  ) {
    products(
      categorySlug: $categorySlug
      page: $page
      perPage: $perPage
    ) {
      data {
        id
        sku
        name
        slug
        price
        specialPrice
        shortDescription
        images {
          url
          label
          role
        }
        brand {
          id
          name
          slug
        }
      }
      paginatorInfo {
        currentPage
        lastPage
        perPage
        total
      }
    }
  }
`;
