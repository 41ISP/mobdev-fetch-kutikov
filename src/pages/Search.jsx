import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import BookCard from "../components/BookCard"
import Loader from "../components/Loader"

const Search = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryParam = searchParams.get("q") || ""
    const [textField, setTextField] = useState(queryParam)
    const [books, setBooks] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const loadBooks = async () => {
            setIsLoading(true)
            const res = await fetch(
                "https://openlibrary.org/search.json" +
                    "?q=" +
                    queryParam +
                    "&limit=20",
            )
            const data = await res.json()
            console.log(data)
            setBooks(data.docs)
            setIsLoading(false)
        }
        loadBooks()
    }, [queryParam])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (textField.trim() === "") return
        navigate("/search?q=" + encodeURIComponent(textField.trim()))
    }

    return (
        <section className="content">
            <div className="search-page-header">
                <div className="section-label">ПОИСК</div>
                <h1>Найдите свою следующую книгу</h1>
                <form
                    onSubmit={handleSubmit}
                    className="search"
                    id="searchForm"
                >
                    <span className="search-icon">⌕</span>
                    <input
                        value={textField}
                        onChange={(e) => setTextField(e.target.value)}
                        id="searchInput"
                        type="text"
                        placeholder="Название, автор или ISBN..."
                    />
                    <button type="submit">Найти</button>
                </form>
            </div>
            <div className="section-header">
                <div>
                    <div className="section-label">РЕЗУЛЬТАТЫ</div>
                    <h2 id="searchTitle">Результаты поиска</h2>
                </div>
                <span className="result-count" id="resultCount">
                    —
                </span>
            </div>
            {isLoading && <Loader />}
            {!isLoading && !error && (
                <div className="book-grid" id="results">
                    {books.map((e) => {
                        const {key, ...props} = e
                        return <BookCard {...props} bookKey={e.key} key={e.key} />
                    })}
                </div>
            )}
        </section>
    )
}

export default Search
