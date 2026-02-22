'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui'

export interface NavBreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: NavBreadcrumbItem[]
}

/**
 * PageBreadcrumb - Navigation breadcrumb for page hierarchy
 * Displays the current navigation path with clickable links.
 * Last item is automatically marked as current page.
 *
 * Example:
 * <PageBreadcrumb
 *   items={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'My Album', href: '/dashboard/album-123' },
 *     { label: 'Song Title' }, // Current page (no href)
 *   ]}
 * />
 */
export const PageBreadcrumb = ({ items }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.flatMap((item, index) => {
          const isLastItem = index === items.length - 1
          const breadcrumbItem = (
            <BreadcrumbItem key={`item-${index}`}>
              {isLastItem ? (
                <BreadcrumbPage className="text-xs text-foreground/64">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    className="text-xs text-foreground/40"
                    href={item.href || '#'}
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )

          if (isLastItem) {
            return [breadcrumbItem]
          }

          return [
            breadcrumbItem,
            <BreadcrumbSeparator
              className="text-foreground/40"
              key={`separator-${index}`}
            />,
          ]
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
