import React from 'react';
import { News } from '../types/News';

interface NewsListProps {
    news: News[];
    onEdit: (news: News) => void;
    onDelete: (id: string) => void;
}

export const NewsList: React.FC<NewsListProps> = ({ news, onEdit, onDelete }) => {
    return (
        <div className="news-list">
            {news.map((item) => (
                <div key={item.id} className="news-item">
                    <div className="news-header">
                        <h3 className="news-title">{item.title}</h3>
                        <div className="news-actions">
                            <button
                                onClick={() => onEdit(item)}
                                className="button button-secondary"
                            >
                                ✏️
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="button button-secondary"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                    <p className="news-content">{item.content}</p>
                    <p className="news-date">
                        {new Date(item.date).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            ))}
            {news.length === 0 && (
                <p className="empty-state">Новостей пока нет</p>
            )}
        </div>
    );
}; 