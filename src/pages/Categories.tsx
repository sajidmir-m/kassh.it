import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from 'lucide-react';

const Categories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">Product Categories</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-muted" />
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => {
              // Map category names to asset images
              const getCategoryImage = (categoryName: string) => {
                const name = categoryName.toLowerCase();
                
                if (name.includes('dairy') || name.includes('milk')) return '/src/assets/dairy.jpeg';
                if (name.includes('fruits') || name.includes('vegetables') || name.includes('veg')) return '/src/assets/fruits-and-veg.jpeg';
                if (name.includes('grocery') || name.includes('food')) return '/src/assets/grocery.jpg';
                if (name.includes('meat') || name.includes('chicken')) return '/src/assets/meat.jpg';
                if (name.includes('breakfast') || name.includes('cereal')) return '/src/assets/breakfast.jpg';
                if (name.includes('snacks') || name.includes('chips')) return '/src/assets/chips.jpeg';
                if (name.includes('biscuits') || name.includes('cookies')) return '/src/assets/buscuits.jpeg';
                if (name.includes('chocolate') || name.includes('candy') || name.includes('sweets')) return '/src/assets/chocolate & candy.jpeg';
                if (name.includes('ice cream') || name.includes('dessert')) return '/src/assets/ice-cream.jpeg';
                if (name.includes('juice') || name.includes('drinks') || name.includes('beverage')) return '/src/assets/juicesandcolddrins.jpeg';
                if (name.includes('tea') || name.includes('coffee')) return '/src/assets/tea-coffee.jpeg';
                if (name.includes('dal') || name.includes('aata') || name.includes('flour')) return '/src/assets/dal-aata.jpeg';
                if (name.includes('masala') || name.includes('spices')) return '/src/assets/masala.jpeg';
                if (name.includes('soap') || name.includes('detergent') || name.includes('shampoo')) return '/src/assets/soapdetergent&shampo.jpeg';
                if (name.includes('stationery') || name.includes('office')) return '/src/assets/stationery.jpeg';
                if (name.includes('kids') || name.includes('baby') || name.includes('child')) return '/src/assets/kidscare.jpeg';
                if (name.includes('feminine') || name.includes('hygiene')) return '/src/assets/feminine-hygiene.jpeg';
                if (name.includes('home') || name.includes('essentials')) return '/src/assets/homeessentionals.jpeg';
                if (name.includes('smart') || name.includes('iot')) return '/src/assets/smart-home.jpeg';
                if (name.includes('tools') || name.includes('hardware')) return '/src/assets/smalltools.jpeg';
                if (name.includes('packaged') || name.includes('processed')) return '/src/assets/packaged-food.jpg';
                
                // Default fallback
                return null;
              };

              const categoryImage = getCategoryImage(category.name);

              return (
                <Link key={category.id} to={`/products?category=${category.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="p-0">
                      <div className="h-32 sm:h-40 bg-gradient-card flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        {categoryImage ? (
                          <img src={categoryImage} alt={category.name} className="object-cover w-full h-full" />
                        ) : category.image_url ? (
                          <img src={category.image_url} alt={category.name} className="object-cover w-full h-full" />
                        ) : (
                          <Folder className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                      <CardTitle className="text-base sm:text-lg text-center">{category.name}</CardTitle>
                      {category.description && (
                        <p className="text-sm text-muted-foreground text-center mt-2 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
