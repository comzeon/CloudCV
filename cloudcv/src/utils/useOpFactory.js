import {inject} from "vue";

export const useOpFactory = () => {
    const OpFactory = inject('OpFactory');

    if (!OpFactory) {
        throw new Error('OpFactory is not provided!');
    }

    return OpFactory;
}