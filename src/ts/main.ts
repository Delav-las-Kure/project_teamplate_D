import { Navigation } from './navigation'
export function MainApp(): string {
  Navigation.init()
  return 'The main application is initiated'
}
