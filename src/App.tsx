import React, { useState, useEffect } from 'react';
import { News } from './types/News';
import { newsService } from './services/newsService';
import { NewsForm } from './components/NewsForm';
import { NewsList } from './components/NewsList';
import { toast } from 'react-toastify';

type SortType = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'none';

function App() {
    const [news, setNews] = useState<News[]>([]);
    const [editingNews, setEditingNews] = useState<News | undefined>();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState<SortType>('none');

    useEffect(() => {
        setNews(newsService.getAll());
    }, []);

    const handleAddNews = (newsData: Omit<News, 'id' | 'date'>) => {
        const newNews = newsService.add(newsData);
        setNews([...news, newNews]);
        setIsFormVisible(false);
        toast.success('Новость успешно добавлена!');
    };

    const handleEditNews = (newsData: Omit<News, 'id' | 'date'>) => {
        if (editingNews) {
            const updatedNews = newsService.update(editingNews.id, newsData);
            if (updatedNews) {
                setNews(news.map(item => item.id === updatedNews.id ? updatedNews : item));
                toast.success('Новость успешно обновлена!');
            } else {
                toast.error('Не удалось обновить новость');
            }
            setEditingNews(undefined);
            setIsFormVisible(false);
        }
    };

    const handleDeleteNews = (id: string) => {
        if (window.confirm('Вы уверены, что хотите удалить эту новость?')) {
            if (newsService.delete(id)) {
                setNews(news.filter(item => item.id !== id));
                toast.success('Новость успешно удалена!');
            } else {
                toast.error('Не удалось удалить новость');
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

    const sortedNews = [...filteredNews].sort((a, b) => {
        switch (sortType) {
            case 'name-asc':
                return a.title.localeCompare(b.title);
            case 'name-desc':
                return b.title.localeCompare(a.title);
            case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'date-desc':
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            default:
                return 0;
        }
    });

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
                <div className="search-header">
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
                    <div className="header-right">
                        <div className="sort-container">
                            <select
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value as SortType)}
                                className="sort-select"
                            >
                                <option value="none">Без сортировки</option>
                                <option value="name-asc">По названию (А-Я)</option>
                                <option value="name-desc">По названию (Я-А)</option>
                                <option value="date-asc">По дате (старые)</option>
                                <option value="date-desc">По дате (новые)</option>
                            </select>
                        </div>
                        <span className="news-count">Всего новостей: {news.length}</span>
                    </div>
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
                news={sortedNews}
                onEdit={handleEditClick}
                onDelete={handleDeleteNews}
            />
        </div>
    );
}

export default App;