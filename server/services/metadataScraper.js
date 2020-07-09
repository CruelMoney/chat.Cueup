import urlMetadata from 'url-metadata';
import { urlMatcher } from './nlp';

export const enrichMessage = async message => {
    let [url] = message.content.match(urlMatcher) || [];
    if (url) {
        url = url.replace(/\s/g, '');
        try {
            const metadata = await urlMetadata(url);
            message.metadata = metadata;
        } catch (error) {
            console.log(error);
        }
    }
};
