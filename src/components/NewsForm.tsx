import React, { useState, useEffect } from 'react';
import { News } from '../types/News';

interface NewsFormProps {
    news?: News;
    onSubmit: (news: Omit<News, 'id' | 'date'>) => void;
    onCancel: () => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({ news, onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (news) {
            setTitle(news.title);
            setContent(news.content);
        }
    }, [news]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit} className="news-form">
            <div className="form-group">
                <label htmlFor="title" className="form-label">
                    Заголовок
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="content" className="form-label">
                    Содержание
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-input form-textarea"
                    required
                />
            </div>
            <div className="button-group">
                <button
                    type="button"
                    onClick={onCancel}
                    className="button button-secondary"
                >
                    Отмена
                </button>
                <button
                    type="submit"
                    className="button button-primary"
                    disabled={!title || !content}
                >
                    {news ? 'Сохранить' : 'Добавить'}
                </button>
            </div>
        </form>
    );
}; 