"use client"
import { useSearchParams } from 'next/navigation'
import { useRef, useEffect } from 'react'

type Props = {
    title: string,
    onClose: () => void,
    onOk: () => void,
    disableOkButton: boolean,
    children: React.ReactNode,
}

export default function Dialog({ title, onClose, onOk, disableOkButton, children }: Props) {

    const searchParams = useSearchParams()
    const dialogRef = useRef<null | HTMLDialogElement>(null)
    const showDialog = searchParams.get('showDialog')

    useEffect(() => {
        if (showDialog === 'y') {
            dialogRef.current?.showModal()
        } else {
            dialogRef.current?.close()
        }
    }, [showDialog])

    const closeDialog = () => {
        dialogRef.current?.close()
        onClose()
    }

    const clickOk = () => {
        onOk()
        closeDialog()
    }

    const getOkButton = () => {
        if (!disableOkButton) {
            return (
                <div className="tw-flex tw-flex-row tw-justify-end tw-mt-2">
                    <button
                        onClick={clickOk}
                        className="tw-bg-green-500 tw-py-1 tw-px-2 tw-rounded tw-border-none"
                    >OK
                    </button>
                </div>
        )}
    }

    const dialog: JSX.Element | null = showDialog === 'y'
        ? (
            <dialog ref={dialogRef} className="tw-fixed tw-top-50 tw-left-50 tw-translate-x-50 tw-translate-y-50 tw-z-10 tw-rounded-xl backdrop:tw-bg-gray-800/50">
                <div className=" tw-w-96 tw-bg-gray-800 tw-flex tw-flex-col">
                    <div className="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-pt-2 tw-px-5 tw-bg-gray-900">
                        <h1 className="tw-text-2xl">{title}</h1>
                        <button
                            onClick={closeDialog}
                            className="tw-mb-2 tw-py-1 tw-px-2 tw-cursor-pointer tw-rounded tw-border-none tw-w-8 tw-h-8 tw-font-bold tw-bg-red-600 tw-text-white"
                        >X</button>
                    </div>
                    <div className="tw-px-5 tw-pb-6 tw-bg-gray-800">
                        {children}
                        {getOkButton()}
                    </div>
                </div>
            </dialog>
        ) : null


    return dialog
}