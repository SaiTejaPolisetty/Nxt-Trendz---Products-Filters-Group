import './index.css'

import {BsSearch} from 'react-icons/bs'

const RenderRating = props => {
  const {ratingDetails, setRatings} = props
  const {imageUrl, ratingId} = ratingDetails

  const changeRating = () => {
    setRatings(ratingId)
  }

  return (
    <li className="rating-list-item">
      <button onClick={changeRating} type="button" className="btn rating-btn">
        <img
          src={imageUrl}
          alt={`rating ${ratingId}`}
          className="rating-image-in-filter-group"
        />
        <p className="up-text">& up</p>
      </button>
    </li>
  )
}

const RenderCategories = props => {
  const {categoryDetails, setCategory} = props
  const {name, categoryId} = categoryDetails

  const changeCategory = () => {
    setCategory(categoryId)
  }

  return (
    <li className="category-item">
      <button
        type="button"
        className="btn category-btn"
        onClick={changeCategory}
      >
        <p>{name}</p>
      </button>
    </li>
  )
}

const FiltersGroup = props => {
  const {
    renderFiltersData,
    setCategory,
    setRatings,
    clearFilters,
    setSearchTitle,
  } = props
  const {categoryOptions, ratingsList} = renderFiltersData

  const callClearFilters = () => {
    clearFilters()
  }

  const callSetTitle = event => {
    setSearchTitle(event)
  }
  return (
    <div className="filters-group-container">
      <div className="products-search-container">
        <input
          type="search"
          onKeyDown={callSetTitle}
          className="search-input"
          placeholder="Search"
        />
        <BsSearch className="sort-by-icon" />
      </div>
      <h1>Filters Group</h1>
      {/* Replace this element with your code */}
      <h1 className="list-heading">Category</h1>
      <ul className="categories-list">
        {categoryOptions.map(obj => (
          <RenderCategories
            categoryDetails={obj}
            setCategory={setCategory}
            key={obj.categoryId}
          />
        ))}
      </ul>
      <ul className="ratings-list">
        <li className="list-heading">Rating</li>
        {ratingsList.map(obj => (
          <RenderRating
            ratingDetails={obj}
            key={obj.ratingId}
            setRatings={setRatings}
          />
        ))}
      </ul>
      <div className="clear-btn-container">
        <button className="clear-btn" onClick={callClearFilters} type="button">
          Clear Filters
        </button>
      </div>
    </div>
  )
}

export default FiltersGroup
