import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GDropdownComponent, GDropdownItem } from '@glance-ui/dropdown';
import { GlanceTab, GlanceTabsComponent } from '@glance-ui/tabs';
import { GTooltipComponent } from '../../../../libs/glance-tooltip/src/lib/g-tooltip/g-tooltip.component';

@Component({
  selector: 'app-nx-welcome',
  standalone: true,
  imports: [
    CommonModule,
    GlanceTabsComponent,
    GDropdownComponent,
    GTooltipComponent,
  ],
  template: `
    <div class="h-screen w-screen">
      <!-- <g-dropdown [items]="items()">
        <button
          toggle
          class="hover:bg-neutral-100 rounded-md p-2 inline-flex items-center justify-center"
        >
          <span class="icon-[lucide--ellipsis-vertical]"></span>
        </button>
      </g-dropdown> -->

      <div class="p-10 flex flex-col container mx-auto h-full w-[60%]">
        <div class="pl-2 flex flex-row justify-between items-end mb-4">
          <div>
            <a
              toggle
              href="/"
              class="text-sm text-primary-500  hover:text-primary-600 duration-100 inline-block mb-2"
            >
              Tacos Strategies</a
            >

            <div class="flex flex-row items-center gap-x-3">
              <h4 class="text-2xl font-semibold text-gray-700 leading-6">
                TACOS Catch all
              </h4>
              <span
                class="text-xs text-green-600 bg-green-100 rounded-md px-1 py-0.5 font-medium uppercase border border-green-300"
                >Active
              </span>
            </div>
          </div>
          <!-- <button
            class="bg-indigo-500 text-white rounded-md px-2 py-1 flex flex-row items-center gap-x-2 hover:bg-indigo-600 duration-100
           focus-visible:outline-none focus:ring-2 focus:ring-indigo-300
            "
          >
            <span class="icon-[lucide--edit-2]"></span>
            <span class="text-sm">Edit Products</span>
          </button> -->

          <g-dropdown [items]="editStrategyItems()" placement="bottom-end">
            <button
              class="bg-white text-gray-700 rounded-md px-2 py-1 flex flex-row items-center gap-x-2 hover:bg-gray-100 duration-100
            border border-gray-300 shadow-sm
           focus-visible:outline-none focus:ring-2 focus:ring-indigo-300 ring-offset-1
            "
              toggle
            >
              <span class="icon-[lucide--settings]"></span>
              <span class="text-sm">Strategy Settings</span>
            </button>
          </g-dropdown>
        </div>

        <g-tabs
          [tabs]="tabs()"
          [activeTab]="activeTab()"
          (onActiveTabChange)="onActiveTabChange($event)"
        />

        <div class="flex-1 py-5">
          @if (activeTabContent().label === 'Advertised Products') {
          <div class="flex justify-between gap-x-2">
            <input
              class="placeholder:text-gray-400 w-full lg:w-[40%] rounded-md border border-gray-200 px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-300 duration-150 ring-offset-1 text-gray-800"
              placeholder="Search by ASIN or title"
            />

            <g-tooltip mode="hover" [delay]="500">
              <button
                class="bg-white text-gray-700 rounded-md px-2 py-1 flex flex-row items-center gap-x-2 hover:bg-gray-100 duration-100
            border border-gray-300 shadow-sm
           focus-visible:outline-none focus:ring-2 focus:ring-indigo-300 ring-offset-1
            "
                toggle
              >
                <span class="icon-[lucide--download]"></span>
                <span class="text-sm">Export</span>
              </button>

              <p class="p-1.5 text-xs" tooltip>Export your products (.csv)</p>
            </g-tooltip>
          </div>
          } @if (activeTabContent().label === 'Activities') {
          <div class="h-full w-full flex items-center justify-center">
            <div class="w-[60%] pb-20">
              <div
                class="flex items-center justify-center bg-gray-100 rounded-md p-2 w-fit mb-4"
              >
                <span class="icon-[lucide--truck] text-gray-400 size-8"></span>
              </div>
              <span
                class="text-gray-800 text-xl font-semibold mb-2 inline-block"
                >Add your first product</span
              >
              <p class="text-gray-500 text-sm mb-2">
                Saisissez vos tarifs de livraison et faites-les apparaître sur
                les reçus, factures et sessions Checkout de vos clients.
              </p>
              <button
                class="bg-indigo-500 text-white rounded-md px-2 py-1 flex flex-row items-center gap-x-2 hover:bg-indigo-600 duration-100
                      focus-visible:outline-none focus:ring-2 focus:ring-indigo-300 ring-offset-1
            "
              >
                <span class="icon-[lucide--plus]"></span>
                <span class="text-sm">Ajouter un produit</span>
              </button>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class NxWelcomeComponent {
  tabs = signal<GlanceTab[]>([
    { label: 'Advertised Products', icon: 'icon-[lucide--box]', badge: '10' },
    { label: 'Strategies', icon: 'icon-[lucide--lightbulb]' },
    { label: 'Stats', icon: 'icon-[lucide--chart-line]' },
    { label: 'Activities', icon: 'icon-[lucide--clock]' },
  ]);

  editStrategyItems = signal<GDropdownItem[][]>([
    [
      { label: 'Pause Strategy', icon: 'icon-[lucide--circle-pause]' },

      { label: 'Edit Name', icon: 'icon-[lucide--edit-2]' },
      { label: 'Edit Target', icon: 'icon-[lucide--percent]' },
    ],
    [{ label: 'Copy Strategy ID', icon: 'icon-[lucide--copy]' }],
    [{ label: 'Delete', icon: 'icon-[lucide--trash]', variant: 'danger' }],
  ]);

  activeTab = signal<number>(0);
  activeTabContent = computed(() => {
    return this.tabs()[this.activeTab()];
  });

  onActiveTabChange(index: number) {
    this.activeTab.set(index);
  }
}
