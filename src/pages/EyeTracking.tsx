import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function EyeTracking() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تتبع حركة العين</h1>
          <p className="text-lg text-gray-600">
            هذا القسم يستعرض خطة دمج نموذج تتبع حركة العين لدعم القراءة والتفاعل البصري للمستخدمين.
            سيتم توفير تجربة تفاعلية توضح اتجاه النظر، مع تحليل لحظي يساعد في تحسين تجربة المستخدم في المستقبل.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-2 text-right">
            <CardTitle>ماذا سنقدم؟</CardTitle>
            <CardDescription>
              نظرة مبسطة على إمكانية تتبع حركة العين وكيف يمكن أن تدعم التجربة التعليمية والتواصلية.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-right text-gray-700">
            <p>
              • مراقبة اتجاه النظر لمعرفة تركيز المستخدم وتقديم ملاحظات حول المحتوى الأكثر جذباً للانتباه.
            </p>
            <p>
              • توفير تقارير لحظية يمكن الاعتماد عليها لاحقاً لتحسين واجهات التفاعل وتجربة المستخدم.
            </p>
            <p className="text-sm text-gray-500">
              الميزة قيد التطوير حالياً، وسيتم تحديث هذا القسم عند توفر النموذج الفعلي.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
