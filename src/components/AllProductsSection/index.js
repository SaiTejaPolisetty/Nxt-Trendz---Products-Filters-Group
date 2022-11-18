import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const renderFiltersData = {categoryOptions, sortbyOptions, ratingsList}

const apiConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
  initial: 'INITIAL',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiConstants.initial,

    activeOptionId: sortbyOptions[0].optionId,
    rating: '',
    titleSearch: '',
    category: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {activeOptionId, rating, titleSearch, category} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${category}&title_search=${titleSearch}&rating=${rating}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,

        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  setSearchTitle = event => {
    const {titleSearch} = this.state

    if (event.key !== 'Enter') {
      this.setState({titleSearch: event.target.value})
    } else if (event.key === 'Enter' && titleSearch !== '') {
      this.setState({titleSearch: event.target.value}, this.getProducts)
    }
  }

  setRatings = id => {
    this.setState({rating: id}, this.getProducts)
  }

  setCategory = id => {
    this.setState({category: id}, this.getProducts)
  }

  clearFilters = () => {
    this.setState(
      {
        rating: '',
        titleSearch: '',
        category: '',
        activeOptionId: sortbyOptions[0].optionId,
      },
      this.getProducts,
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having Some trouble in processing request.</p>
    </div>
  )

  renderNoProducts = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
    </div>
  )

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.length === 0
            ? this.renderNoProducts()
            : productsList.map(product => (
                <ProductCard productData={product} key={product.id} />
              ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  // TODO: Add failure view

  render() {
    const {rating, apiStatus} = this.state
    let result

    switch (apiStatus) {
      case apiConstants.failure:
        result = this.renderFailure()
        break
      case apiConstants.inProgress:
        result = this.renderLoader()
        break
      case apiConstants.success:
        result = this.renderProductsList()
        break

      default:
        result = null
        break
    }
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          renderFiltersData={renderFiltersData}
          setCategory={this.setCategory}
          setRatings={this.setRatings}
          clearFilters={this.clearFilters}
          setSearchTitle={this.setSearchTitle}
          rating={rating}
        />

        {result}
      </div>
    )
  }
}

export default AllProductsSection