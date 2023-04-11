<template>
    <div class="text-field" id="text-field">
        <label v-if="label" :for="id" class="text-field__label">{{ label }}</label>
        <input :id="id" :type="type" :placeholder="placeholder" :disabled="disabled" class="text-field__input"
            :value="value" @input="updateValue" />
    </div>
</template>

<script lang="ts">
//   defineProps<{ id: string, label: string, type: string, value: string, placeholder: string, disabled: boolean }>()

export default {
    name: "TextField",
    template: "text-field",
    methods: {
        updateValue(event: any) {
            this.$emit("update:value", event.target.value);
        },
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        label: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "text",
        },
        value: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
.text-field {
    @apply flex flex-col w-full min-h-[30px];
}

.text-field__label {
    @apply text-gray-700 font-medium mb-2;
}

.text-field__input {
    @apply border border-gray-300 rounded px-3 py-2 focus:border-blue-500 focus:outline-none;
}
</style>
