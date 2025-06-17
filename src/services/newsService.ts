import { News } from '../types/News';

const STORAGE_KEY = 'news_articles';

export const newsService = {
    getAll: (): News[] => {
        const news = localStorage.getItem(STORAGE_KEY);
        return news ? JSON.parse(news) : [];
    },

    add: (news: Omit<News, 'id' | 'date'>): News => {
        const allNews = newsService.getAll();
        const newNews: News = {
            ...news,
            id: crypto.randomUUID(),
            date: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...allNews, newNews]));
        return newNews;
    },

    update: (id: string, news: Partial<News>): News | null => {
        const allNews = newsService.getAll();
        const index = allNews.findIndex(item => item.id === id);
        if (index === -1) return null;

        const updatedNews = { ...allNews[index], ...news };
        allNews[index] = updatedNews;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allNews));
        return updatedNews;
    },

    delete: (id: string): boolean => {
        const allNews = newsService.getAll();
        const filteredNews = allNews.filter(item => item.id !== id);
        if (filteredNews.length === allNews.length) return false;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNews));
        return true;
    }
}; 