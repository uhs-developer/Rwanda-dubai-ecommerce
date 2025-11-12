import { gql } from 'urql';

// ========== PAGE CONTENT (STOREFRONT) ==========
export const GET_PAGE_CONTENT = gql`
  query GetPageContent($pageKey: String!) {
    adminPageContent(pageKey: $pageKey) {
      id
      pageKey
      pageName
      sections {
        key
        label
        content
      }
      updatedAt
    }
  }
`;

// ========== FAQs (STOREFRONT) ==========
export const GET_FAQS = gql`
  query GetFaqs {
    faqs {
      id
      category
      categoryLabel
      question
      answer
    }
  }
`;

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
    $brandIds: [ID!]
    $minPrice: Float
    $maxPrice: Float
    $inStock: Boolean
    $sortBy: String
  ) {
    products(
      q: $q
      page: $page
      perPage: $perPage
      categorySlug: $categorySlug
      brandSlug: $brandSlug
      brandIds: $brandIds
      minPrice: $minPrice
      maxPrice: $maxPrice
      inStock: $inStock
      sortBy: $sortBy
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

export const GET_PRODUCT_FILTERS = gql`
  query GetProductFilters(
    $q: String
    $categorySlug: String
    $brandSlug: String
    $brandIds: [ID!]
    $minPrice: Float
    $maxPrice: Float
    $inStock: Boolean
  ) {
    productFilters(
      q: $q
      categorySlug: $categorySlug
      brandSlug: $brandSlug
      brandIds: $brandIds
      minPrice: $minPrice
      maxPrice: $maxPrice
      inStock: $inStock
    ) {
      minPrice
      maxPrice
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
      brands {
        id
        name
        slug
      }
      availableFilters {
        hasInStockFilter
        priceRange {
          min
          max
        }
        categoryCount
        brandCount
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

// ========== FEATURED PRODUCTS ==========
export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($perPage: Int, $isFeatured: Boolean) {
    products(perPage: $perPage, isFeatured: $isFeatured) {
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

// ========== STOREFRONT BRANDS ==========
export const GET_BRANDS = gql`
  query GetBrands {
    brands {
      id
      name
      slug
    }
  }
`;

// ========== CURRENT USER ==========
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      addresses {
        firstname
        lastname
        street
        city
        region
        postcode
        country
        telephone
      }
    }
  }
`;
