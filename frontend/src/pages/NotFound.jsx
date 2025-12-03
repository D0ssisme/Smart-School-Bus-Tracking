import { useLanguage } from '../contexts/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center bg-slate-50'>
      <img src="404_NotFound.png" alt="not found" className='max-w-full mb-6 w-96' />
      <p className='text-xl font-semibold'>
        {t('notFound.message')}
      </p>
      <a
        href="/"
        className='inline-block px-6 py-3 mt-6 font-medium !text-white transition shadow-md bg-blue-900 rounded-2xl hover:bg-primary-dark'>
        {t('notFound.backHome')}
      </a>

    </div>
  )
}

export default NotFound