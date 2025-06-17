import React, { useState, useEffect } from 'react';
import { News } from './types/News';
import { newsService } from './services/newsService';
import { NewsForm } from './components/NewsForm';
import { NewsList } from './components/NewsList';

function App() {
    const [news, setNews] = useState<News[]>([]);
    const [editingNews, setEditingNews] = useState<News | undefined>();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setNews(newsService.getAll());
    }, []);

    const handleAddNews = (newsData: Omit<News, 'id' | 'date'>) => {
        const newNews = newsService.add(newsData);
        setNews([...news, newNews]);
        setIsFormVisible(false);
    };

    const handleEditNews = (newsData: Omit<News, 'id' | 'date'>) => {
        if (editingNews) {
            const updatedNews = newsService.update(editingNews.id, newsData);
            if (updatedNews) {
                setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
            }
            setEditingNews(undefined);
            setIsFormVisible(false);
        }
    };

    const handleDeleteNews = (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
            if (newsService.delete(id)) {
                setNews(news.filter(item => item.id !== id));
            }
        }
    };

    const handleEditClick = (news: News) => {
        setEditingNews(news);
        setIsFormVisible(true);
    };

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <div className="header">
                <h1 className="title">Новости</h1>
                <button
                    onClick={() => {
                        setEditingNews(undefined);
                        setIsFormVisible(true);
                    }}
                    className="button button-primary"
                >
                    Добавить новость
                </button>
            </div>
            <div className="search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Поиск по названию или описанию..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <button
                            className="clear-button"
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {isFormVisible && (
                <NewsForm
                    news={editingNews}
                    onSubmit={editingNews ? handleEditNews : handleAddNews}
                    onCancel={() => {
                        setIsFormVisible(false);
                        setEditingNews(undefined);
                    }}
                />
            )}

            <NewsList
                news={filteredNews}
                onEdit={handleEditClick}
                onDelete={handleDeleteNews}
            />
        </div>
    );
}

export default App;